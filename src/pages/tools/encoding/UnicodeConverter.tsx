import { ComingSoon } from '../../../components/shared/ComingSoon';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { Type } from 'lucide-react';

export default function UnicodeConverter() {
  return (
    <ToolPageLayout
      seo={{
        title: "Unicode Converter - Free Online Unicode Escape Tool",
        description: "Convert between Unicode and text online. Free Unicode converter that escapes and unescapes Unicode characters. Perfect for handling special characters in programming and web development.",
        keywords: "unicode converter, unicode escape, unicode unescape, convert unicode, unicode tool, unicode encoder, unicode decoder, free converter",
        path: "/tools/unicode-converter"
      }}
      icon={Type}
      title="Unicode Converter"
      description="Convert between Unicode and text"
      category="encoders"
    >
      <ComingSoon toolId='unicode-converter' toolName='Unicode Converter' description='Convert between Unicode and text' />
    </ToolPageLayout>
  );
}
