import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
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
    <div className="space-y-6">
      {/* Compact Hero Section with Breadcrumb & Actions */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          {/* Breadcrumb Navigation */}
        <div className="px-6 pt-4 pb-2">
          <Breadcrumb />
        </div>

        {/* Single Row: Title, Icon & Action Buttons */}
          <div className="flex items-center justify-between gap-4 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <CaseSensitive className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Case Converter</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Convert text between different casing styles
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={loadSample} variant="outline" size="sm">
                Load Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
