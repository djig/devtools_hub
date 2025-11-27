import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Tags, FileCode } from 'lucide-react';

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  author: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
  themeColor: string;
  locale: string;
}

export default function MetaTagGenerator() {
  const { addRecentTool } = useAppStore();
  const [formData, setFormData] = useState<MetaTags>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    siteName: '',
    twitterHandle: '',
    themeColor: '#0ea5e9',
    locale: 'en_US',
  });

  useEffect(() => {
    addRecentTool('meta-tag-generator');
  }, [addRecentTool]);

  const generateMetaTags = (): string => {
    const { title, description, keywords, author, url, image, siteName, twitterHandle, themeColor, locale } = formData;

    let tags = `<!-- Primary Meta Tags -->\n`;
    if (title) tags += `<meta name="title" content="${title}" />\n`;
    if (description) tags += `<meta name="description" content="${description}" />\n`;
    if (keywords) tags += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) tags += `<meta name="author" content="${author}" />\n`;

    tags += `<meta name="robots" content="index, follow" />\n`;
    tags += `<meta name="language" content="English" />\n`;
    if (themeColor) tags += `<meta name="theme-color" content="${themeColor}" />\n`;

    if (url || title || description || image) {
      tags += `\n<!-- Open Graph / Facebook -->\n`;
      tags += `<meta property="og:type" content="website" />\n`;
      if (url) tags += `<meta property="og:url" content="${url}" />\n`;
      if (title) tags += `<meta property="og:title" content="${title}" />\n`;
      if (description) tags += `<meta property="og:description" content="${description}" />\n`;
      if (image) tags += `<meta property="og:image" content="${image}" />\n`;
      if (siteName) tags += `<meta property="og:site_name" content="${siteName}" />\n`;
      if (locale) tags += `<meta property="og:locale" content="${locale}" />\n`;
    }

    if (url || title || description || image) {
      tags += `\n<!-- Twitter Card -->\n`;
      tags += `<meta name="twitter:card" content="summary_large_image" />\n`;
      if (url) tags += `<meta name="twitter:url" content="${url}" />\n`;
      if (title) tags += `<meta name="twitter:title" content="${title}" />\n`;
      if (description) tags += `<meta name="twitter:description" content="${description}" />\n`;
      if (image) tags += `<meta name="twitter:image" content="${image}" />\n`;
      if (twitterHandle) tags += `<meta name="twitter:creator" content="@${twitterHandle.replace('@', '')}" />\n`;
    }

    return tags;
  };

  const loadSample = () => {
    setFormData({
      title: 'DevTools Hub - Free Developer Tools & Utilities Online',
      description: 'Free collection of developer tools including JSON formatter, Base64 encoder, UUID generator, regex tester, and more. All tools run in your browser.',
      keywords: 'developer tools, json formatter, base64 encoder, jwt decoder, uuid generator, regex tester',
      author: 'DevTools Hub',
      url: 'https://engtoolshub.com/',
      image: 'https://engtoolshub.com/og-image.svg',
      siteName: 'DevTools Hub',
      twitterHandle: 'devtoolshub',
      themeColor: '#0ea5e9',
      locale: 'en_US',
    });
  };

  const clearAll = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      url: '',
      image: '',
      siteName: '',
      twitterHandle: '',
      themeColor: '#0ea5e9',
      locale: 'en_US',
    });
  };

  const metaTags = generateMetaTags();
  const hasContent = Object.values(formData).some(value => value && value !== '#0ea5e9' && value !== 'en_US');

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meta Tag Generator</h1>
        <p className="text-muted-foreground">
          Generate HTML meta tags for SEO, Open Graph, and Twitter Cards
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={loadSample} variant="outline">
          Load Sample
        </Button>
        <Button onClick={clearAll} variant="ghost">
          Clear All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Tags className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Basic Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title *</label>
              <Input
                placeholder="Your Site - Best Tools for Developers"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">50-60 characters recommended</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="A comprehensive description of your page content..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">150-160 characters recommended</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <Input
                placeholder="keyword1, keyword2, keyword3"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                placeholder="Your Name or Company"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Social Media & Advanced */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Social Media & Advanced</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page URL</label>
              <Input
                placeholder="https://yoursite.com/"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="https://yoursite.com/og-image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">1200x630px recommended for social sharing</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input
                placeholder="Your Site Name"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter Handle</label>
              <Input
                placeholder="yourusername"
                value={formData.twitterHandle}
                onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Without @ symbol</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Locale</label>
                <Input
                  placeholder="en_US"
                  value={formData.locale}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Generated Output */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Generated Meta Tags</h3>
          {hasContent && <CopyButton text={metaTags} />}
        </div>
        <div className="relative">
          <Textarea
            value={metaTags}
            readOnly
            className="min-h-[400px] font-mono text-sm"
            placeholder="Fill in the form above to generate meta tags..."
          />
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Meta Tags</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>Title & Description:</strong> Essential for SEO and social sharing</p>
          <p>• <strong>Open Graph:</strong> Controls how your page appears when shared on Facebook, LinkedIn, etc.</p>
          <p>• <strong>Twitter Cards:</strong> Optimizes appearance on Twitter/X</p>
          <p>• <strong>Theme Color:</strong> Sets the browser toolbar color on mobile devices</p>
          <p>• Place these tags in the <code className="px-1 py-0.5 rounded bg-muted">&lt;head&gt;</code> section of your HTML</p>
        </div>
      </Card>
    </div>
  );
}
