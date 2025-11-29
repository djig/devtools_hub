import { ComingSoon } from '../../../components/shared/ComingSoon';
import { SEO } from '../../../utils/seo';
export default function CidrCalculator() {
  return (
    <>
      <SEO
        title="CIDR Calculator - Calculate IP Ranges and Subnet Masks"
        description="Calculate IP ranges and subnet masks online. Free CIDR calculator for network engineers and administrators. Compute network addresses, broadcast addresses, and usable IPs."
        keywords="cidr calculator, subnet calculator, ip range calculator, subnet mask, network calculator, cidr tool, ip calculator, free calculator"
        path="/tools/cidr-calculator"
      />
      <ComingSoon toolId='cidr-calculator' toolName='CIDR Calculator' description='Calculate IP ranges and subnet masks' />
    </>
  );
}
