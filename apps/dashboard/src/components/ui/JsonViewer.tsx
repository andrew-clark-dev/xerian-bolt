import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { theme } from '../../theme';

interface JsonViewerProps {
  data: unknown;
  defaultExpanded?: boolean;
}

export function JsonViewer({ data, defaultExpanded = true }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative ${theme.surface('secondary')} rounded-lg border ${theme.border()}`}>
      <div className="absolute right-4 top-4">
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-lg transition-colors ${theme.component('button', 'secondary')}`}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <JsonNode data={data} level={0} defaultExpanded={defaultExpanded} />
    </div>
  );
}

interface JsonNodeProps {
  data: unknown;
  level: number;
  defaultExpanded: boolean;
}

function JsonNode({ data, level, defaultExpanded }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const indent = level * 20;

  if (data === null) {
    return <span className="text-gray-500">null</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>;
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{data}</span>;
  }

  if (typeof data === 'string') {
    return <span className="text-green-600 dark:text-green-400">"{data}"</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500">[]</span>;
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          Array[{data.length}]
        </button>
        {isExpanded && (
          <div style={{ marginLeft: indent }}>
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <JsonNode data={item} level={level + 1} defaultExpanded={defaultExpanded} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <span className="text-gray-500">{}</span>;
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div style={{ marginLeft: indent }}>
            {entries.map(([key, value]) => (
              <div key={key} className="py-1">
                <span className="text-gray-600 dark:text-gray-400">{key}: </span>
                <JsonNode data={value} level={level + 1} defaultExpanded={defaultExpanded} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}