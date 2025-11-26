import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with{' '}
            <Heart className="inline h-4 w-4 text-red-500 fill-current" /> by developers, for
            developers
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DevTools Hub. All tools run locally in your browser.
        </div>
      </div>
    </footer>
  );
}
