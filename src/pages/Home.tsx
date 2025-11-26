import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ToolCard } from '../components/shared/ToolCard';
import { tools, categories } from '../data/tools';
import { useDebounce } from '../hooks/useDebounce';
import { searchTools } from '../data/tools';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredTools = debouncedSearch ? searchTools(debouncedSearch) : tools;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Developer Tools Hub</h1>
          <p className="text-muted-foreground">
            A collection of 40+ developer utilities, all running locally in your browser
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {debouncedSearch ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Search Results ({filteredTools.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          {filteredTools.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No tools found matching "{debouncedSearch}"
            </p>
          )}
        </div>
      ) : (
        <>
          {categories.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category.id);
            const Icon = category.icon;

            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
