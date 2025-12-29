export type AuditStatus = 'pass' | 'warning' | 'fail';
export type AuditPriority = 'critical' | 'high' | 'medium' | 'low';
export type AuditCategory = 'technical' | 'content' | 'performance' | 'social' | 'accessibility' | 'security';

export interface DetailItem {
  label: string;
  value: string | number | boolean;
  status?: AuditStatus;
  description?: string;
}

export interface AuditResult {
  module: string;
  status: AuditStatus;
  score: number; // 0-100
  priority: AuditPriority;
  category: AuditCategory;
  summary: string;
  issues: string[];
  suggestions: string[];
  details?: DetailItem[];
  data?: unknown;
}

// Helper function to calculate status from score
export function getStatusFromScore(score: number): AuditStatus {
  if (score >= 80) return 'pass';
  if (score >= 50) return 'warning';
  return 'fail';
}

// Helper function to calculate priority from score and category
export function getPriorityFromScore(score: number): AuditPriority {
  if (score < 30) return 'critical';
  if (score < 50) return 'high';
  if (score < 80) return 'medium';
  return 'low';
}
