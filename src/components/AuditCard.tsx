import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AuditResult } from '../modules/types';
import { ScoreCircle } from './ScoreCircle';

interface AuditCardProps {
  result: AuditResult;
  index?: number;
}

export function AuditCard({ result, index = 0 }: AuditCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    pass: {
      icon: CheckCircle,
      bgGlow: 'hover:shadow-[0_0_40px_rgba(0,212,170,0.15)]',
      borderColor: 'border-accent-primary/30',
      iconColor: 'text-accent-primary',
      badgeClass: 'badge-success',
      score: 100,
    },
    warning: {
      icon: AlertTriangle,
      bgGlow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
      borderColor: 'border-accent-warning/30',
      iconColor: 'text-accent-warning',
      badgeClass: 'badge-warning',
      score: 65,
    },
    fail: {
      icon: XCircle,
      bgGlow: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]',
      borderColor: 'border-accent-error/30',
      iconColor: 'text-accent-error',
      badgeClass: 'badge-error',
      score: 30,
    },
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;
  const hasDetails = result.issues.length > 0 || result.suggestions.length > 0;

  return (
    <div
      className={`
        card ${config.bgGlow} ${config.borderColor}
        animate-slide-up transition-all duration-300
        hover:border-opacity-100
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Score circle */}
        <div className="hidden sm:block">
          <ScoreCircle score={config.score} size="sm" showLabel={false} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                <span className={config.badgeClass}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-content-primary">
                {result.module}
              </h3>
            </div>

            {/* Mobile score */}
            <div className="sm:hidden">
              <ScoreCircle score={config.score} size="sm" showLabel={false} />
            </div>
          </div>

          <p className="mt-2 text-content-secondary">{result.summary}</p>
        </div>
      </div>

      {/* Expandable details */}
      {hasDetails && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-content-tertiary hover:text-content-primary transition-colors"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4 animate-fade-in">
              {result.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-accent-error mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Issues Found
                  </h4>
                  <ul className="space-y-2">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-content-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-error mt-1.5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-accent-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-content-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 flex-shrink-0" />
                        {suggestion}
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
