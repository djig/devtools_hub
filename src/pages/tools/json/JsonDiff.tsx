import { ComingSoon } from '../../../components/shared/ComingSoon';
import { SEO } from '../../../utils/seo';

export default function JsonDiff() {
  return (
    <>
      <SEO
        title="JSON Diff - Free Online JSON Comparison Tool"
        description="Compare and diff two JSON objects online to see differences side-by-side. Free JSON comparison tool that highlights changes, additions, and deletions between JSON data. Perfect for debugging and code reviews."
        keywords="json diff, json compare, json difference, compare json online, json comparison tool, diff json, json validator, json merge, free json diff"
        path="/tools/json-diff"
      />
      <ComingSoon toolId='json-diff' toolName='JSON Diff' description='Compare two JSON objects and see differences' />
    </>
  );
}
