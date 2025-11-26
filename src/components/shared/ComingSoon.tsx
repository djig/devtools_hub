import { useEffect } from 'react';
import { Card } from '../ui/Card';
import useAppStore from '../../store/useAppStore';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  toolId: string;
  toolName: string;
  description: string;
}

export function ComingSoon({ toolId, toolName, description }: ComingSoonProps) {
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool(toolId);
  }, [addRecentTool, toolId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{toolName}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="p-12 text-center">
        <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          This tool is currently under development. Check back soon for the full implementation!
        </p>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-2">About This Tool</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground mt-3">
          All 47 tools are registered and the UI is ready. This tool's functionality will be
          implemented soon. In the meantime, check out our other available tools!
        </p>
      </Card>
    </div>
  );
}
