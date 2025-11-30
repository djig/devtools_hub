import { ComingSoon } from '../../../components/shared/ComingSoon';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { Database } from 'lucide-react';

export default function SqlFormatter() {
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
      description="Format and beautify SQL queries"
    >
      <ComingSoon toolId='sql-formatter' toolName='SQL Formatter' description='Format and beautify SQL queries' />
    </ToolPageLayout>
  );
}
