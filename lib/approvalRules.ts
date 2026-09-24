import { ApprovalStep, Role } from './types';

export interface ApprovalRuleConfig {
  thresholdMin: number;
  thresholdMax: number | null; // null for infinite
  levels: {
    level: number;
    role: Role;
    roleName: string;
  }[];
}

// Configurable approval rules
export const APPROVAL_RULES_CONFIG: ApprovalRuleConfig[] = [
  {
    thresholdMin: 0,
    thresholdMax: 25000,
    levels: [
      { level: 1, role: 'DEPARTMENT_MANAGER', roleName: 'Department Manager' },
    ],
  },
  {
    thresholdMin: 25001,
    thresholdMax: 100000,
    levels: [
      { level: 1, role: 'DEPARTMENT_MANAGER', roleName: 'Department Manager' },
      { level: 2, role: 'PROCUREMENT_MANAGER', roleName: 'Procurement Manager' },
    ],
  },
  {
    // Configurable tier for amounts above 1 Lakh
    thresholdMin: 100001,
    thresholdMax: null,
    levels: [
      { level: 1, role: 'DEPARTMENT_MANAGER', roleName: 'Department Manager' },
      { level: 2, role: 'PROCUREMENT_MANAGER', roleName: 'Procurement Manager' },
      { level: 3, role: 'FINANCE', roleName: 'Finance Controller' },
    ],
  },
];

export function calculateApprovalLevels(amount: number): ApprovalStep[] {
  const matchingRule = APPROVAL_RULES_CONFIG.find((rule) => {
    if (rule.thresholdMax === null) {
      return amount >= rule.thresholdMin;
    }
    return amount >= rule.thresholdMin && amount <= rule.thresholdMax;
  }) || APPROVAL_RULES_CONFIG[0];

  return matchingRule.levels.map((lvl) => ({
    level: lvl.level,
    role: lvl.role,
    roleName: lvl.roleName,
    status: 'PENDING',
  }));
}

export function canUserApproveAtStep(
  userRole: Role,
  currentLevel: number,
  approvals: ApprovalStep[]
): boolean {
  const step = approvals.find((a) => a.level === currentLevel);
  if (!step || step.status !== 'PENDING') return false;

  // Department manager can approve level 1
  if (step.role === 'DEPARTMENT_MANAGER' && userRole === 'DEPARTMENT_MANAGER') {
    return true;
  }
  // Procurement manager can approve level 2
  if (step.role === 'PROCUREMENT_MANAGER' && userRole === 'PROCUREMENT_MANAGER') {
    return true;
  }
  // Finance can approve level 3
  if (step.role === 'FINANCE' && userRole === 'FINANCE') {
    return true;
  }
  // Admin has emergency override
  if (userRole === 'ADMIN') {
    return true;
  }

  return false;
}
