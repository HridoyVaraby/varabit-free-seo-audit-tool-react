import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { AuditResult } from '../modules/types';

interface AuditCardProps {
  result: AuditResult;
}

export function AuditCard({ result }: AuditCardProps) {
  const statusConfig = {
    pass: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    fail: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    }
  };

  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <Icon className={`${config.iconColor} w-6 h-6 flex-shrink-0 mt-1`} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{result.module}</h3>
          <p className={`${config.textColor} font-medium mb-4`}>{result.summary}</p>

          {result.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Issues:</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-slate-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-slate-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
