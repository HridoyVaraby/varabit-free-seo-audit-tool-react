export interface AuditResult {
  module: string;
  status: 'pass' | 'warning' | 'fail';
  summary: string;
  issues: string[];
  suggestions: string[];
  data?: unknown;
}
