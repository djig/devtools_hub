import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CopyButton } from '../../../components/shared/CopyButton';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import * as caseUtils from '../../../utils/text/case';
import { CaseSensitive } from 'lucide-react';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('case-converter');
  }, [addRecentTool]);

  const conversions = input
    ? [
        { label: 'camelCase', value: caseUtils.toCamelCase(input) },
        { label: 'PascalCase', value: caseUtils.toPascalCase(input) },
        { label: 'snake_case', value: caseUtils.toSnakeCase(input) },
        { label: 'kebab-case', value: caseUtils.toKebabCase(input) },
        { label: 'CONSTANT_CASE', value: caseUtils.toConstantCase(input) },
        { label: 'Title Case', value: caseUtils.toTitleCase(input) },
        { label: 'lowercase', value: caseUtils.toLowercase(input) },
        { label: 'UPPERCASE', value: caseUtils.toUppercase(input) },
      ]
    : [];

  const loadSample = () => {
    setInput('hello world example');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Case Converter - Convert Text Case Online (camelCase, snake_case, etc.)",
        description: "Convert text between different cases online: camelCase, snake_case, kebab-case, PascalCase, UPPER CASE, and lower case. Free case converter for developers and writers.",
        keywords: "case converter, camel case, snake case, kebab case, pascal case, convert case, text case, case transformer, free converter",
        path: "/tools/case-converter"
      }}
      icon={CaseSensitive}
      title="Case Converter"
      description="Convert text between different casing styles"
      actions={
        <Button onClick={loadSample} variant="outline" size="sm">
          Load Sample
        </Button>
      }
    >

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Input Text</h3>
        <Textarea
          placeholder="Enter text to convert..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px]"
        />
      </Card>

      {conversions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversions.map((conversion) => (
            <Card key={conversion.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {conversion.label}
                </h3>
                <CopyButton text={conversion.value} />
              </div>
              <div className="p-3 rounded bg-muted/50 break-all font-mono text-sm">
                {conversion.value}
              </div>
            </Card>
          ))}
        </div>
      )}
    </ToolPageLayout>
  );
}
