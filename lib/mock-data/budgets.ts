import { Budget } from '../types';

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bgt-1',
    departmentId: 'dept-eng',
    departmentName: 'Engineering',
    fiscalYear: 'FY 2026-27',
    allocatedBudget: 5000000, // 50 Lakhs INR
    utilizedBudget: 1850000,
    committedSpend: 420000,
    availableBudget: 2730000,
    utilizationPercentage: 45.4,
  },
  {
    id: 'bgt-2',
    departmentId: 'dept-fin',
    departmentName: 'Finance & Accounts',
    fiscalYear: 'FY 2026-27',
    allocatedBudget: 3000000, // 30 Lakhs INR
    utilizedBudget: 920000,
    committedSpend: 150000,
    availableBudget: 1930000,
    utilizationPercentage: 35.7,
  },
  {
    id: 'bgt-3',
    departmentId: 'dept-hr',
    departmentName: 'Human Resources',
    fiscalYear: 'FY 2026-27',
    allocatedBudget: 2000000, // 20 Lakhs INR
    utilizedBudget: 680000,
    committedSpend: 80000,
    availableBudget: 1240000,
    utilizationPercentage: 38.0,
  },
];
