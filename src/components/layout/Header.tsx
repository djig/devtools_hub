import { Menu, Moon, Sun, Monitor, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import useAppStore from '../../store/useAppStore';
import { Link } from 'react-router-dom';

export function Header() {
  const { theme, setTheme, toggleSidebar } = useAppStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/" className="mr-6 flex items-center space-x-2">
          <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            DevTools Hub
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/">
              <Button variant="outline" className="w-full md:w-64 justify-start text-muted-foreground">
                <Search className="mr-2 h-4 w-4" />
                <span>Search tools...</span>
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" onClick={cycleTheme}>
            <ThemeIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
