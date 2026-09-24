import { Budget } from '../lib/types';
import { INITIAL_BUDGETS } from '../lib/mock-data/budgets';

export const budgetService = {
  getAll: (): Budget[] => INITIAL_BUDGETS,
  getByDepartment: (deptId: string): Budget | undefined =>
    INITIAL_BUDGETS.find((b) => b.departmentId === deptId),
};
