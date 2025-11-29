import { useLocation } from 'react-router-dom';
import { getToolByPath, getCategoryInfo } from '../data/tools';
import type { ToolCategory } from '../types';

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

const DEFAULT_KEYWORDS =
  'developer tools, json formatter, base64 encoder, jwt decoder, uuid generator, regex tester, url encoder, html encoder, yaml formatter, xml formatter, sql formatter, hash generator, qr code generator, epoch converter, color converter, markdown editor, text diff, code minifier, online tools, web tools, free tools, developer utilities, programming tools';

const DEFAULT_META: PageMeta = {
  title: 'DevTools Hub - 47+ Free Developer Tools & Utilities Online',
  description:
    'Free collection of 47+ developer tools including JSON formatter, Base64 encoder, UUID generator, regex tester, and more. All tools run in your browser - fast, secure, and private.',
  keywords: DEFAULT_KEYWORDS,
};

const getPageMeta = (pathname: string): PageMeta => {
  // Homepage
  if (pathname === '/') {
    return DEFAULT_META;
  }

  // Tool pages
  const tool = getToolByPath(pathname);
  if (tool) {
    const toolKeywords = [
      ...tool.keywords,
      'online tool',
      'free tool',
      'browser tool',
      'developer tool',
      'web tool',
    ].join(', ');
    return {
      title: `${tool.name} - Free Online Tool | DevTools Hub`,
      description: `${tool.description} - Free, fast, and secure. No registration required. All processing happens in your browser.`,
      keywords: toolKeywords,
    };
  }

  // Category pages
  const categoryMatch = pathname.match(/^\/category\/(.+)$/);
  if (categoryMatch) {
    const categoryId = categoryMatch[1] as ToolCategory;
    const category = getCategoryInfo(categoryId);
    if (category) {
      const categoryKeywords = [
        category.name.toLowerCase(),
        'developer tools',
        'online tools',
        'free tools',
        'web tools',
        'browser tools',
        'programming tools',
      ].join(', ');
      return {
        title: `${category.name} - Free Developer Tools | DevTools Hub`,
        description: `${category.description} - Browse our collection of free online ${category.name.toLowerCase()} that run entirely in your browser.`,
        keywords: categoryKeywords,
      };
    }
  }

  // Favorites page
  if (pathname === '/favorites') {
    return {
      title: 'My Favorite Tools | DevTools Hub',
      description:
        'Access your favorite developer tools quickly. Browse and manage your bookmarked tools for faster workflow.',
      keywords:
        'favorite tools, bookmarked tools, saved tools, developer favorites, quick access tools',
    };
  }

  // Recent page
  if (pathname === '/recent') {
    return {
      title: 'Recently Used Tools | DevTools Hub',
      description:
        'View your recently used developer tools. Quick access to the tools you use most frequently.',
      keywords:
        'recent tools, recently used tools, tool history, frequently used tools, quick access',
    };
  }

  // 404 or unknown routes
  if (!pathname.startsWith('/category/') && !pathname.startsWith('/tools/')) {
    return {
      title: '404 - Page Not Found | DevTools Hub',
      description:
        'The page you are looking for does not exist. Browse our collection of 47+ free developer tools and utilities.',
      keywords:
        '404, page not found, developer tools, web tools, online utilities, free tools',
    };
  }

  // Fallback to default (for any edge cases)
  return DEFAULT_META;
};

export function usePageMeta(): PageMeta {
  const location = useLocation();
  return getPageMeta(location.pathname);
}
