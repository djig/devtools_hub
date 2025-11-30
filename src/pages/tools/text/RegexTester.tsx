import { useState, useEffect, useMemo } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, Search } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('regex-tester');
  }, [addRecentTool]);

  const result = useMemo(() => {
    if (!pattern || !testString) return null;

    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(regex));
      setError('');

      return {
        matches,
        count: matches.length,
        groups: matches.map((match) => ({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index,
        })),
      };
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!result || result.count === 0) return testString;

    try {
      let lastIndex = 0;
      const parts: React.ReactElement[] = [];

      result.matches.forEach((match, i) => {
        const matchIndex = match.index!;
        const matchText = match[0];

        // Add text before match
        if (matchIndex > lastIndex) {
          parts.push(
            <span key={`text-${i}`}>
              {testString.substring(lastIndex, matchIndex)}
            </span>
          );
        }

        // Add highlighted match
        parts.push(
          <mark
            key={`match-${i}`}
            className="bg-yellow-200 dark:bg-yellow-800 font-semibold"
          >
            {matchText}
          </mark>
        );

        lastIndex = matchIndex + matchText.length;
      });

      // Add remaining text
      if (lastIndex < testString.length) {
        parts.push(
          <span key="text-end">{testString.substring(lastIndex)}</span>
        );
      }

      return <>{parts}</>;
    } catch {
      return testString;
    }
  }, [result, pattern, flags, testString]);

  const loadSample = () => {
    setPattern('\\b\\w+@\\w+\\.\\w+\\b');
    setFlags('g');
    setTestString('Contact us at support@example.com or sales@company.org for more info.');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Regex Tester - Free Online Regular Expression Tester",
        description: "Test regular expressions with real-time matching online. Free regex tester with syntax highlighting, match highlighting, and pattern explanation. Supports JavaScript, Python, and PCRE regex.",
        keywords: "regex tester, regular expression tester, regex tool, regex matcher, test regex, regex debugger, regexp tester, free regex tool",
        path: "/tools/regex-tester"
      }}
      icon={Search}
      title="Regex Tester"
      description="Test regular expressions with real-time matching and highlighting"
      actions={
        <Button onClick={loadSample} variant="ghost" size="sm">
          Load Sample
        </Button>
      }
    >

      <Card className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Regex Pattern</label>
          <Input
            placeholder="Enter regex pattern (e.g., \d{3}-\d{3}-\d{4})"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="font-mono"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Flags</label>
          <div className="flex gap-4 flex-wrap">
            {[
              { flag: 'g', label: 'Global' },
              { flag: 'i', label: 'Case Insensitive' },
              { flag: 'm', label: 'Multiline' },
              { flag: 's', label: 'Dot All' },
            ].map(({ flag, label }) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags(flags + flag);
                    } else {
                      setFlags(flags.replace(flag, ''));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{label} ({flag})</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/10">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Invalid Regex</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Test String</label>
        <CodeEditor
          value={testString}
          onChange={setTestString}
          language="plaintext"
          placeholder="Enter test string..."
          height="200px"
        />
      </div>

      {result && result.count > 0 && (
        <>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Matches: {result.count}
              </h3>
            </div>
            <div className="p-4 rounded border border-border bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all">
              {highlightedText}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Match Details
            </h3>
            <div className="space-y-2">
              {result.groups.map((group, index) => (
                <div
                  key={index}
                  className="p-3 rounded border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Match {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @ index {group.index}
                    </span>
                  </div>
                  <p className="font-mono text-sm mb-2">
                    <span className="text-muted-foreground">Full match:</span>{' '}
                    <span className="font-semibold">{group.fullMatch}</span>
                  </p>
                  {group.groups.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Capture Groups:
                      </p>
                      {group.groups.map((g, i) => (
                        <p key={i} className="font-mono text-sm">
                          Group {i + 1}: {g}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {result && result.count === 0 && (
        <Card className="p-4 text-center text-muted-foreground">
          No matches found
        </Card>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-2">Common Regex Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <p className="text-muted-foreground">Email: \b\w+@\w+\.\w+\b</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone: \d{3}-\d{3}-\d{4}</p>
          </div>
          <div>
            <p className="text-muted-foreground">URL: https?://[^\s]+</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hex Color: #[0-9A-Fa-f]{6}</p>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
