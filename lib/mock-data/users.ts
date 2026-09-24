import { User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Rajesh Verma',
    email: 'admin@sourcelyx.com',
    role: 'ADMIN',
    title: 'Chief Information Officer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-procurement',
    name: 'Rohan Mehta',
    email: 'procurement@sourcelyx.com',
    role: 'PROCUREMENT',
    title: 'Lead Procurement Officer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-proc-mgr',
    name: 'Sunita Krishnan',
    email: 'procurement.manager@sourcelyx.com',
    role: 'PROCUREMENT_MANAGER',
    title: 'Head of Global Procurement',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-finance',
    name: 'Ananya Sharma',
    email: 'finance@sourcelyx.com',
    role: 'FINANCE',
    departmentId: 'dept-fin',
    title: 'VP of Finance & Controller',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-manager',
    name: 'Vikram Malhotra',
    email: 'manager@sourcelyx.com',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'dept-eng',
    title: 'Director of Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-vendor',
    name: 'Amit Patel',
    email: 'vendor@sourcelyx.com',
    role: 'VENDOR',
    vendorId: 'ven-1',
    title: 'Managing Director, Techtron',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-auditor',
    name: 'Kavita Menon',
    email: 'auditor@sourcelyx.com',
    role: 'AUDITOR',
    title: 'Senior Compliance Auditor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export const DEMO_PASSWORD = 'password123';
