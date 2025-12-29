import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ScoreCircle } from './ScoreCircle';
import type { AuditResult, DetailItem } from '../modules/types';

interface AuditCardProps {
  result: AuditResult;
  index?: number;
}

const priorityConfig = {
  critical: { label: 'Critical', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  high: { label: 'High', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  medium: { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low: { label: 'Low', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

const categoryLabels: Record<string, string> = {
  performance: 'Performance',
  content: 'Content',
  technical: 'Technical',
  social: 'Social',
  accessibility: 'Accessibility',
  security: 'Security',
};

function DetailItemRow({ item }: { item: DetailItem }) {
  const statusIcon = {
    pass: <CheckCircle className="w-4 h-4 text-accent-primary" />,
    warning: <AlertTriangle className="w-4 h-4 text-accent-warning" />,
    fail: <AlertCircle className="w-4 h-4 text-accent-error" />,
  };

  return (
    <div className="flex items-start justify-between py-2 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2">
        {item.status && statusIcon[item.status]}
        <span className="text-sm text-content-secondary">{item.label}</span>
      </div>
      <div className="text-right">
        <span className="text-sm text-content-primary font-medium">
          {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : String(item.value)}
        </span>
        {item.description && (
          <p className="text-xs text-content-tertiary mt-0.5">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export function AuditCard({ result, index = 0 }: AuditCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasDetails = (result.details && result.details.length > 0) ||
    result.issues.length > 0 ||
    result.suggestions.length > 0;

  const statusConfig = {
    pass: {
      bgGlow: 'hover:shadow-[0_0_30px_rgba(0,212,170,0.1)]',
      borderColor: 'border-accent-primary/20 hover:border-accent-primary/40',
    },
    warning: {
      bgGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]',
      borderColor: 'border-accent-warning/20 hover:border-accent-warning/40',
    },
    fail: {
      bgGlow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]',
      borderColor: 'border-accent-error/20 hover:border-accent-error/40',
    },
  };

  const config = statusConfig[result.status];
  const priorityCfg = priorityConfig[result.priority];

  return (
    <div
      className={`
        card ${config.bgGlow} ${config.borderColor}
        animate-slide-up transition-all duration-300
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <ScoreCircle score={result.score} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-semibold text-lg text-content-primary">
              {result.module}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityCfg.className}`}>
              {priorityCfg.label}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-surface-tertiary text-content-tertiary">
              {categoryLabels[result.category] || result.category}
            </span>
          </div>
          <p className="text-content-secondary text-sm line-clamp-2">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Expandable Details */}
      {hasDetails && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-content-tertiary hover:text-content-primary transition-colors rounded-lg hover:bg-white/[0.02]"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4 animate-fade-in">
              {/* Detailed Items */}
              {result.details && result.details.length > 0 && (
                <div className="bg-surface-primary/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-content-primary mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Details
                  </h4>
                  <div className="space-y-0">
                    {result.details.map((item, idx) => (
                      <DetailItemRow key={idx} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="bg-accent-error/5 rounded-lg p-4 border border-accent-error/10">
                  <h4 className="text-sm font-semibold text-accent-error mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Issues Found ({result.issues.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-content-secondary flex items-start gap-2">
                        <span className="text-accent-error mt-1.5">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="bg-accent-primary/5 rounded-lg p-4 border border-accent-primary/10">
                  <h4 className="text-sm font-semibold text-accent-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Recommendations ({result.suggestions.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-content-secondary flex items-start gap-2">
                        <span className="text-accent-primary mt-1.5">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
