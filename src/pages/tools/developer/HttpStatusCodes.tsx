import { useState, useEffect, useMemo } from 'react';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import useAppStore from '../../../store/useAppStore';
import { Search, Server } from 'lucide-react';
import { SEO } from '../../../utils/seo';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body', category: '1xx Informational' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols', category: '1xx Informational' },
  { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet', category: '1xx Informational' },
  { code: 103, name: 'Early Hints', description: 'Used to return some response headers before final HTTP message', category: '1xx Informational' },

  // 2xx Success
  { code: 200, name: 'OK', description: 'Standard response for successful HTTP requests', category: '2xx Success' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and resulted in a new resource being created', category: '2xx Success' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed', category: '2xx Success' },
  { code: 203, name: 'Non-Authoritative Information', description: 'The server successfully processed the request but is returning information from another source', category: '2xx Success' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request but is not returning any content', category: '2xx Success' },
  { code: 205, name: 'Reset Content', description: 'The server successfully processed the request but requires the requester to reset the document view', category: '2xx Success' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header', category: '2xx Success' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'Indicates multiple options for the resource from which the client may choose', category: '3xx Redirection' },
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI', category: '3xx Redirection' },
  { code: 302, name: 'Found', description: 'The resource was found but at a different URI', category: '3xx Redirection' },
  { code: 303, name: 'See Other', description: 'The response to the request can be found under another URI using GET method', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', description: 'Indicates that the resource has not been modified since last requested', category: '3xx Redirection' },
  { code: 307, name: 'Temporary Redirect', description: 'The request should be repeated with another URI but future requests should use the original URI', category: '3xx Redirection' },
  { code: 308, name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI', category: '3xx Redirection' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to a client error', category: '4xx Client Error' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided', category: '4xx Client Error' },
  { code: 402, name: 'Payment Required', description: 'Reserved for future use', category: '4xx Client Error' },
  { code: 403, name: 'Forbidden', description: 'The request was valid, but the server is refusing action', category: '4xx Client Error' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found', category: '4xx Client Error' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource', category: '4xx Client Error' },
  { code: 406, name: 'Not Acceptable', description: 'The requested resource is capable of generating only content not acceptable according to Accept headers', category: '4xx Client Error' },
  { code: 407, name: 'Proxy Authentication Required', description: 'The client must first authenticate itself with the proxy', category: '4xx Client Error' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request', category: '4xx Client Error' },
  { code: 409, name: 'Conflict', description: 'Indicates that the request could not be processed because of conflict in the request', category: '4xx Client Error' },
  { code: 410, name: 'Gone', description: 'Indicates that the resource requested is no longer available and will not be available again', category: '4xx Client Error' },
  { code: 411, name: 'Length Required', description: 'The request did not specify the length of its content', category: '4xx Client Error' },
  { code: 412, name: 'Precondition Failed', description: 'The server does not meet one of the preconditions specified in the request', category: '4xx Client Error' },
  { code: 413, name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process', category: '4xx Client Error' },
  { code: 414, name: 'URI Too Long', description: 'The URI provided was too long for the server to process', category: '4xx Client Error' },
  { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type which the server does not support', category: '4xx Client Error' },
  { code: 416, name: 'Range Not Satisfiable', description: 'The client has asked for a portion of the file but the server cannot supply that portion', category: '4xx Client Error' },
  { code: 417, name: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request-header field', category: '4xx Client Error' },
  { code: 418, name: "I'm a teapot", description: 'This code was defined in 1998 as an April Fools\' joke', category: '4xx Client Error' },
  { code: 421, name: 'Misdirected Request', description: 'The request was directed at a server that is not able to produce a response', category: '4xx Client Error' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors', category: '4xx Client Error' },
  { code: 423, name: 'Locked', description: 'The resource that is being accessed is locked', category: '4xx Client Error' },
  { code: 424, name: 'Failed Dependency', description: 'The request failed because it depended on another request that failed', category: '4xx Client Error' },
  { code: 425, name: 'Too Early', description: 'Indicates that the server is unwilling to risk processing a request that might be replayed', category: '4xx Client Error' },
  { code: 426, name: 'Upgrade Required', description: 'The client should switch to a different protocol', category: '4xx Client Error' },
  { code: 428, name: 'Precondition Required', description: 'The origin server requires the request to be conditional', category: '4xx Client Error' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time', category: '4xx Client Error' },
  { code: 431, name: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because header fields are too large', category: '4xx Client Error' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: 'A server operator has received a legal demand to deny access to a resource', category: '4xx Client Error' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'A generic error message when the server encounters an unexpected condition', category: '5xx Server Error' },
  { code: 501, name: 'Not Implemented', description: 'The server either does not recognize the request method or lacks the ability to fulfill it', category: '5xx Server Error' },
  { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server', category: '5xx Server Error' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unavailable (overloaded or down for maintenance)', category: '5xx Server Error' },
  { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server', category: '5xx Server Error' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request', category: '5xx Server Error' },
  { code: 506, name: 'Variant Also Negotiates', description: 'Transparent content negotiation for the request results in a circular reference', category: '5xx Server Error' },
  { code: 507, name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request', category: '5xx Server Error' },
  { code: 508, name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request', category: '5xx Server Error' },
  { code: 510, name: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it', category: '5xx Server Error' },
  { code: 511, name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access', category: '5xx Server Error' },
];

export default function HttpStatusCodes() {
  const [search, setSearch] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('http-status-codes');
  }, [addRecentTool]);

  const filteredCodes = useMemo(() => {
    if (!search) return STATUS_CODES;

    const searchLower = search.toLowerCase();
    return STATUS_CODES.filter(
      (status) =>
        status.code.toString().includes(searchLower) ||
        status.name.toLowerCase().includes(searchLower) ||
        status.description.toLowerCase().includes(searchLower) ||
        status.category.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const groupedCodes = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    filteredCodes.forEach((code) => {
      if (!groups[code.category]) {
        groups[code.category] = [];
      }
      groups[code.category].push(code);
    });
    return groups;
  }, [filteredCodes]);

  const getCategoryColor = (category: string) => {
    if (category.startsWith('1xx')) return 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700';
    if (category.startsWith('2xx')) return 'bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700';
    if (category.startsWith('3xx')) return 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700';
    if (category.startsWith('4xx')) return 'bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-700';
    if (category.startsWith('5xx')) return 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700';
    return 'bg-muted';
  };

  const getCodeColor = (code: number) => {
    if (code < 200) return 'text-blue-700 dark:text-blue-400';
    if (code < 300) return 'text-green-700 dark:text-green-400';
    if (code < 400) return 'text-yellow-700 dark:text-yellow-400';
    if (code < 500) return 'text-orange-700 dark:text-orange-400';
    return 'text-red-700 dark:text-red-400';
  };

  return (
    <>
      <SEO
        title="HTTP Status Codes - Complete Reference Guide"
        description="Browse HTTP status codes with descriptions and examples online. Free HTTP status code reference for web developers. Includes 1xx, 2xx, 3xx, 4xx, and 5xx codes."
        keywords="http status codes, http codes, status code reference, http response codes, 404 error, 200 ok, http status, free reference"
        path="/tools/http-status-codes"
      />
      <div className="space-y-6">
      {/* Compact Hero Section with Breadcrumb */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          {/* Breadcrumb Navigation */}
        <div className="px-6 pt-4 pb-2">
          <Breadcrumb />
        </div>

        <div className="flex items-center gap-4 px-6 pb-6">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">HTTP Status Codes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Reference guide for HTTP response status codes
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {Object.entries(groupedCodes).map(([category, codes]) => (
        <Card key={category} className={`p-4 border-2 ${getCategoryColor(category)}`}>
          <h2 className="text-lg font-bold mb-4">{category}</h2>
          <div className="space-y-3">
            {codes.map((status) => (
              <div
                key={status.code}
                className="p-3 rounded-lg bg-background border border-border"
              >
                <div className="flex items-start gap-3">
                  <span className={`text-2xl font-bold font-mono ${getCodeColor(status.code)}`}>
                    {status.code}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{status.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {status.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {filteredCodes.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No status codes found matching your search
        </Card>
      )}
      </div>
    </>
  );
}
