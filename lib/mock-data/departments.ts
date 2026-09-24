import { Department } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-eng',
    name: 'Engineering',
    code: 'ENG',
    managerId: 'usr-manager',
    managerName: 'Vikram Malhotra',
  },
  {
    id: 'dept-fin',
    name: 'Finance & Accounts',
    code: 'FIN',
    managerId: 'usr-finance',
    managerName: 'Ananya Sharma',
  },
  {
    id: 'dept-hr',
    name: 'Human Resources',
    code: 'HR',
    managerId: 'usr-hr-mgr',
    managerName: 'Priya Nambiar',
  },
];
