import { ComingSoon } from '../../../components/shared/ComingSoon';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { Shield } from 'lucide-react';

export default function SslDecoder() {
  return (
    <ToolPageLayout
      seo={{
        title: "SSL Certificate Decoder - Decode and Analyze SSL Certificates",
        description: "Decode and analyze SSL/TLS certificates online. Free SSL decoder that displays certificate details, expiration dates, and issuer information. X.509 certificate parser.",
        keywords: "ssl decoder, certificate decoder, ssl certificate, tls certificate, x509 decoder, parse certificate, ssl tool, free decoder",
        path: "/tools/ssl-decoder"
      }}
      icon={Shield}
      title="SSL Certificate Decoder"
      description="Decode and analyze SSL certificates"
    >
      <ComingSoon toolId='ssl-decoder' toolName='SSL Certificate Decoder' description='Decode and analyze SSL certificates' />
    </ToolPageLayout>
  );
}
