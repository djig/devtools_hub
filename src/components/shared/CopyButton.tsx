import { Check, Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import { useClipboard } from '../../hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copy(text)}
      disabled={!text}
      className={className}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}
