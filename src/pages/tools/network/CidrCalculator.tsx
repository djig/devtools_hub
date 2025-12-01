import { ComingSoon } from '../../../components/shared/ComingSoon';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { Network } from 'lucide-react';

export default function CidrCalculator() {
  return (
    <ToolPageLayout
      seo={{
        title: "CIDR Calculator - Calculate IP Ranges and Subnet Masks",
        description: "Calculate IP ranges and subnet masks online. Free CIDR calculator for network engineers and administrators. Compute network addresses, broadcast addresses, and usable IPs.",
        keywords: "cidr calculator, subnet calculator, ip range calculator, subnet mask, network calculator, cidr tool, ip calculator, free calculator",
        path: "/tools/cidr-calculator"
      }}
      icon={Network}
      title="CIDR Calculator"
      description="Calculate IP ranges and subnet masks"
      category="network"
    >
      <ComingSoon toolId='cidr-calculator' toolName='CIDR Calculator' description='Calculate IP ranges and subnet masks' />
    </ToolPageLayout>
  );
}
