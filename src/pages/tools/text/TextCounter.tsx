import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { countText } from '../../../utils/text/counter';
import { AlignLeft, FileText, List, Clock } from 'lucide-react';

export default function TextCounter() {
  const [input, setInput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('text-counter');
  }, [addRecentTool]);

  const stats = countText(input);

  const statCards = [
    { label: 'Characters', value: stats.characters, icon: AlignLeft },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces, icon: AlignLeft },
    { label: 'Words', value: stats.words, icon: FileText },
    { label: 'Lines', value: stats.lines, icon: List },
    { label: 'Sentences', value: stats.sentences, icon: FileText },
    { label: 'Paragraphs', value: stats.paragraphs, icon: FileText },
    { label: 'Reading Time', value: `${stats.readingTime} min`, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Text Counter</h1>
        <p className="text-muted-foreground">
          Count characters, words, lines, sentences, and more
        </p>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Enter Text</h3>
        <Textarea
          placeholder="Type or paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[300px]"
        />
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
