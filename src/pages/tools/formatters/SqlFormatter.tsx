import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { format } from 'sql-formatter';
import { Parser } from 'node-sql-parser';
import { Database, AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react';

type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'mariadb' | 'sqlite' | 'tsql' | 'plsql';

interface Recommendation {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  line?: number;
  category?: string;
}

interface SqlAnalysis {
  isValid: boolean;
  queryType: string[];
  tables: string[];
  columns: string[];
  hasWhere: boolean;
  hasJoin: boolean;
  complexityScore: number;
  recommendations: Recommendation[];
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<SqlDialect>('sql');
  const [analysis, setAnalysis] = useState<SqlAnalysis | null>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('sql-formatter');
  }, [addRecentTool]);

  const parseAndAnalyzeSql = (sql: string): SqlAnalysis => {
    const recommendations: Recommendation[] = [];
    const trimmedSql = sql.trim();
    let isValid = true;
    let parsedAst: any = null;
    let queryTypes: string[] = [];
    let tables: string[] = [];
    let columns: string[] = [];
    let hasWhere = false;
    let hasJoin = false;
    let complexityScore = 0;

    // Check for empty query
    if (!trimmedSql) {
      recommendations.push({
        type: 'error',
        category: 'Syntax',
        message: 'Query is empty',
      });
      return {
        isValid: false,
        queryType: [],
        tables: [],
        columns: [],
        hasWhere: false,
        hasJoin: false,
        complexityScore: 0,
        recommendations,
      };
    }

    // Map dialect to parser option
    const getParserDialect = (dialect: SqlDialect) => {
      switch (dialect) {
        case 'mysql': return 'MySQL';
        case 'postgresql': return 'PostgresQL';
        case 'mariadb': return 'MariaDB';
        case 'sqlite': return 'SQLite';
        case 'tsql': return 'TransactSQL';
        default: return 'MySQL'; // Use MySQL as default for standard SQL
      }
    };

    // Initialize parser with appropriate dialect
    const parser = new Parser();
    const parserDialect = getParserDialect(dialect);

    try {
      // Parse SQL using node-sql-parser
      parsedAst = parser.astify(trimmedSql, { database: parserDialect });

      // Handle single query or multiple queries
      const queries = Array.isArray(parsedAst) ? parsedAst : [parsedAst];

      // Extract information from parsed AST
      queries.forEach((query: any) => {
        // Get query type
        if (query.type) {
          const type = query.type.toUpperCase();
          if (!queryTypes.includes(type)) {
            queryTypes.push(type);
          }
        }

        // Extract tables
        if (query.from) {
          query.from.forEach((fromItem: any) => {
            if (fromItem.table) {
              const tableName = typeof fromItem.table === 'string' ? fromItem.table : fromItem.table.table || fromItem.table;
              if (tableName && !tables.includes(tableName)) {
                tables.push(tableName);
              }
            }
          });
        }

        // Check for table in UPDATE
        if (query.table) {
          const tableName = typeof query.table === 'string' ? query.table : query.table.table || query.table[0]?.table;
          if (tableName && !tables.includes(tableName)) {
            tables.push(tableName);
          }
        }

        // Check for table in INSERT
        if (query.table) {
          const tableName = typeof query.table === 'string' ? query.table : query.table.table || query.table[0]?.table;
          if (tableName && !tables.includes(tableName)) {
            tables.push(tableName);
          }
        }

        // Extract columns from SELECT
        if (query.columns) {
          if (query.columns === '*') {
            // SELECT * detected
          } else if (Array.isArray(query.columns)) {
            query.columns.forEach((col: any) => {
              if (col.expr && col.expr.column) {
                if (!columns.includes(col.expr.column)) {
                  columns.push(col.expr.column);
                }
              } else if (col.as) {
                if (!columns.includes(col.as)) {
                  columns.push(col.as);
                }
              }
            });
          }
        }

        // Check for WHERE clause
        if (query.where) {
          hasWhere = true;
        }

        // Check for JOINs
        if (query.from) {
          query.from.forEach((fromItem: any) => {
            if (fromItem.join) {
              hasJoin = true;
            }
          });
        }
      });

      isValid = true;

    } catch (error: any) {
      isValid = false;
      recommendations.push({
        type: 'error',
        category: 'Syntax',
        message: `Syntax Error: ${error.message || 'Invalid SQL syntax'}`,
      });
    }

    // Calculate complexity score
    if (isValid) {
      complexityScore += queryTypes.length * 10;
      complexityScore += tables.length * 5;

      const upperSql = trimmedSql.toUpperCase();
      const joinCount = (upperSql.match(/\s+JOIN\s+/gi) || []).length;
      const unionCount = (upperSql.match(/\s+UNION\s+/gi) || []).length;
      const subqueryCount = (upperSql.match(/\(\s*SELECT/gi) || []).length;

      complexityScore += joinCount * 15;
      complexityScore += unionCount * 20;
      complexityScore += subqueryCount * 25;
      complexityScore += hasWhere ? 5 : 0;
    }

    // Only run recommendations if query is valid
    if (isValid) {
      const upperSql = trimmedSql.toUpperCase();

      // Security checks
      if (trimmedSql.includes('${') || trimmedSql.includes('`${') || trimmedSql.includes("'+") || trimmedSql.includes('"+')) {
        recommendations.push({
          type: 'error',
          category: 'Security',
          message: '🔒 CRITICAL: Potential SQL injection vulnerability detected. Use parameterized queries instead of string concatenation.',
        });
      }

      // Check for dangerous operations
      if ((queryTypes.includes('UPDATE') && !hasWhere) || (queryTypes.includes('DELETE') && !hasWhere)) {
        recommendations.push({
          type: 'error',
          category: 'Safety',
          message: '⚠️ DANGER: UPDATE or DELETE without WHERE clause will affect ALL rows!',
        });
      }

      if (upperSql.includes('DROP TABLE') || upperSql.includes('TRUNCATE')) {
        recommendations.push({
          type: 'error',
          category: 'Safety',
          message: '⚠️ DESTRUCTIVE: Query contains DROP TABLE or TRUNCATE operation',
        });
      }

      // Performance warnings
      if (upperSql.includes('SELECT *') || trimmedSql.match(/SELECT\s+\*/i)) {
        recommendations.push({
          type: 'warning',
          category: 'Performance',
          message: 'SELECT * detected. Explicitly specify column names for better performance and clarity.',
        });
      }

      if (upperSql.match(/WHERE.*\sOR\s/)) {
        recommendations.push({
          type: 'warning',
          category: 'Performance',
          message: 'OR conditions in WHERE clause can prevent index usage. Consider using UNION or IN instead.',
        });
      }

      if (upperSql.match(/LIKE\s+['"]%/)) {
        recommendations.push({
          type: 'warning',
          category: 'Performance',
          message: 'LIKE with leading wildcard (%) prevents index usage. Consider full-text search.',
        });
      }

      if (upperSql.includes('NOT IN')) {
        recommendations.push({
          type: 'warning',
          category: 'Performance',
          message: 'NOT IN can be slow with large datasets. Consider using NOT EXISTS or LEFT JOIN with NULL check.',
        });
      }

      // Optimization suggestions
      if (hasWhere) {
        recommendations.push({
          type: 'info',
          category: 'Optimization',
          message: 'Consider adding indexes on columns used in WHERE clauses for better query performance.',
        });
      }

      if (upperSql.includes('DISTINCT')) {
        recommendations.push({
          type: 'info',
          category: 'Optimization',
          message: 'DISTINCT can be expensive. Consider if GROUP BY or removing duplicates at source is better.',
        });
      }

      if (upperSql.match(/\(\s*SELECT/)) {
        recommendations.push({
          type: 'info',
          category: 'Optimization',
          message: 'Subqueries detected. Consider if JOINs or CTEs (WITH clause) would be more efficient.',
        });
      }

      if (queryTypes.includes('SELECT') && !upperSql.includes('LIMIT') && !upperSql.includes('TOP')) {
        recommendations.push({
          type: 'info',
          category: 'Best Practice',
          message: 'Consider adding LIMIT/TOP clause to prevent accidentally fetching large result sets.',
        });
      }

      const joinCount = (upperSql.match(/\s+JOIN\s+/gi) || []).length;
      if (joinCount > 3) {
        recommendations.push({
          type: 'info',
          category: 'Complexity',
          message: `Query has ${joinCount} JOINs. Complex queries may benefit from denormalization or caching.`,
        });
      }

      // Success message if no issues
      if (recommendations.length === 0) {
        recommendations.push({
          type: 'success',
          category: 'Validation',
          message: '✓ Query looks good! No major issues detected.',
        });
      }
    }

    return {
      isValid,
      queryType: queryTypes,
      tables,
      columns,
      hasWhere,
      hasJoin,
      complexityScore,
      recommendations,
    };
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setAnalysis(null);
      return;
    }
    const result = parseAndAnalyzeSql(input);
    setAnalysis(result);
  };

  const handleFormat = () => {
    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
      const result = parseAndAnalyzeSql(input);
      setAnalysis(result);
    } catch (err) {
      setOutput(`Error formatting SQL: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAnalysis(null);
    }
  };

  const handleMinify = () => {
    try {
      // Minify by removing extra whitespace and newlines
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/\s*([(),;])\s*/g, '$1')
        .trim();
      setOutput(minified);
      const result = parseAndAnalyzeSql(input);
      setAnalysis(result);
    } catch (err) {
      setOutput(`Error minifying SQL: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAnalysis(null);
    }
  };

  const loadSample = () => {
    setInput(`SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' ORDER BY o.total DESC LIMIT 10;`);
  };

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
    }
  };

  const getComplexityLevel = (score: number) => {
    if (score < 30) return { label: 'Simple', color: 'text-green-600' };
    if (score < 60) return { label: 'Moderate', color: 'text-yellow-600' };
    if (score < 100) return { label: 'Complex', color: 'text-orange-600' };
    return { label: 'Very Complex', color: 'text-destructive' };
  };

  return (
    <ToolPageLayout
      seo={{
        title: "SQL Formatter - Free Online SQL Query Beautifier",
        description: "Format and beautify SQL queries online with our free SQL formatter. Clean up messy SQL code with proper indentation and formatting. Supports multiple SQL dialects. Works entirely in your browser.",
        keywords: "sql formatter, sql beautifier, format sql online, sql query formatter, beautify sql, sql tool, sql pretty print, mysql formatter, postgresql formatter, free sql formatter",
        path: "/tools/sql-formatter"
      }}
      icon={Database}
      title="SQL Formatter"
      description="Format and beautify SQL queries with validation"
      actions={
        <>
          <Select
            value={dialect}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDialect(e.target.value as SqlDialect)}
            className="w-40"
          >
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mariadb">MariaDB</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL</option>
            <option value="plsql">PL/SQL</option>
          </Select>
          <Button onClick={handleValidate} variant="default" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Validate
          </Button>
          <Button onClick={handleFormat} size="sm">Format</Button>
          <Button onClick={handleMinify} variant="outline" size="sm">Minify</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input SQL</label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="sql"
              placeholder="Paste your SQL query here..."
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            <CodeEditor
              value={output}
              language="sql"
              readOnly
              placeholder="Formatted SQL will appear here..."
              height="400px"
            />
          </div>
        </div>

        {analysis && (
          <>
            {/* Query Analysis Summary */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Query Analysis</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={`text-sm font-semibold ${analysis.isValid ? 'text-green-600' : 'text-destructive'}`}>
                    {analysis.isValid ? '✓ Valid' : '✗ Invalid'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Query Type</p>
                  <p className="text-sm font-semibold">
                    {analysis.queryType.length > 0 ? analysis.queryType.join(', ') : 'Unknown'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tables</p>
                  <p className="text-sm font-semibold">{analysis.tables.length || 0}</p>
                  {analysis.tables.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">{analysis.tables.join(', ')}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Complexity</p>
                  <p className={`text-sm font-semibold ${getComplexityLevel(analysis.complexityScore).color}`}>
                    {getComplexityLevel(analysis.complexityScore).label} ({analysis.complexityScore})
                  </p>
                </div>
              </div>

              {analysis.columns.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Columns ({analysis.columns.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.columns.slice(0, 10).map((col, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-muted rounded">
                        {col}
                      </span>
                    ))}
                    {analysis.columns.length > 10 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{analysis.columns.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Recommendations ({analysis.recommendations.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${getRecommendationColor(rec.type)}`}
                    >
                      {getRecommendationIcon(rec.type)}
                      <div className="flex-1">
                        {rec.category && (
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            {rec.category}
                          </p>
                        )}
                        <p className="text-sm">{rec.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">SQL Best Practices Tips:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Always use parameterized queries to prevent SQL injection</li>
                <li>Specify column names instead of SELECT *</li>
                <li>Include WHERE clauses in UPDATE and DELETE statements</li>
                <li>Add appropriate indexes on frequently queried columns</li>
                <li>Use EXPLAIN/ANALYZE to understand query execution plans</li>
                <li>Avoid using functions on indexed columns in WHERE clauses</li>
                <li>Consider using JOINs instead of subqueries for better performance</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
