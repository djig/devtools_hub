import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { CopyButton } from './CopyButton';
import { cn } from '../../lib/utils';

interface InputOutputProps {
  input: ReactNode;
  output: ReactNode;
  outputValue?: string;
  showCopy?: boolean;
  className?: string;
}

export function InputOutput({
  input,
  output,
  outputValue,
  showCopy = true,
  className,
}: InputOutputProps) {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-4', className)}>
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Input</h3>
        {input}
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Output</h3>
          {showCopy && outputValue && <CopyButton text={outputValue} />}
        </div>
        {output}
      </Card>
    </div>
  );
}
