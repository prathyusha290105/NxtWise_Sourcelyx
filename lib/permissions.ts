import { Role } from './types';

export type Permission =
  | 'VIEW_ADMIN_DASHBOARD'
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES'
  | 'APPROVE_VENDOR_FINAL'
  | 'VIEW_AUDIT_LOGS'
  | 'VIEW_PROCUREMENT_DASHBOARD'
  | 'VERIFY_VENDOR'
  | 'VIEW_ALL_VENDORS'
  | 'MANAGE_PURCHASE_REQUESTS'
  | 'APPROVE_PURCHASE_REQUEST_DEPT'
  | 'APPROVE_PURCHASE_REQUEST_PROCUREMENT'
  | 'APPROVE_PURCHASE_REQUEST_FINANCE'
  | 'CREATE_RFQ'
  | 'VIEW_ALL_QUOTATIONS'
  | 'COMPARE_QUOTATIONS'
  | 'SELECT_VENDOR_QUOTATION'
  | 'GENERATE_PURCHASE_ORDER'
  | 'VIEW_PURCHASE_ORDERS'
  | 'MANAGE_BUDGETS'
  | 'VIEW_SPEND_ANALYTICS'
  | 'CREATE_PURCHASE_REQUEST_DEPT'
  | 'VIEW_DEPT_PURCHASE_REQUESTS'
  | 'VIEW_VENDOR_PORTAL'
  | 'SUBMIT_QUOTATION'
  | 'VIEW_ASSIGNED_RFQS'
  | 'READ_ONLY_AUDIT';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'VIEW_ADMIN_DASHBOARD',
    'MANAGE_USERS',
    'MANAGE_ROLES',
    'APPROVE_VENDOR_FINAL',
    'VIEW_AUDIT_LOGS',
    'VIEW_ALL_VENDORS',
    'VIEW_PURCHASE_ORDERS',
    'VIEW_SPEND_ANALYTICS',
    'MANAGE_BUDGETS',
  ],
  PROCUREMENT: [
    'VIEW_PROCUREMENT_DASHBOARD',
    'VERIFY_VENDOR',
    'VIEW_ALL_VENDORS',
    'MANAGE_PURCHASE_REQUESTS',
    'CREATE_RFQ',
    'VIEW_ALL_QUOTATIONS',
    'COMPARE_QUOTATIONS',
    'SELECT_VENDOR_QUOTATION',
    'GENERATE_PURCHASE_ORDER',
    'VIEW_PURCHASE_ORDERS',
    'VIEW_SPEND_ANALYTICS',
  ],
  PROCUREMENT_MANAGER: [
    'VIEW_PROCUREMENT_DASHBOARD',
    'APPROVE_PURCHASE_REQUEST_PROCUREMENT',
    'VERIFY_VENDOR',
    'VIEW_ALL_VENDORS',
    'MANAGE_PURCHASE_REQUESTS',
    'CREATE_RFQ',
    'VIEW_ALL_QUOTATIONS',
    'COMPARE_QUOTATIONS',
    'SELECT_VENDOR_QUOTATION',
    'GENERATE_PURCHASE_ORDER',
    'VIEW_PURCHASE_ORDERS',
    'VIEW_SPEND_ANALYTICS',
  ],
  FINANCE: [
    'MANAGE_BUDGETS',
    'VIEW_SPEND_ANALYTICS',
    'APPROVE_PURCHASE_REQUEST_FINANCE',
    'VIEW_PURCHASE_ORDERS',
  ],
  DEPARTMENT_MANAGER: [
    'CREATE_PURCHASE_REQUEST_DEPT',
    'VIEW_DEPT_PURCHASE_REQUESTS',
    'APPROVE_PURCHASE_REQUEST_DEPT',
  ],
  VENDOR: [
    'VIEW_VENDOR_PORTAL',
    'SUBMIT_QUOTATION',
    'VIEW_ASSIGNED_RFQS',
  ],
  AUDITOR: [
    'READ_ONLY_AUDIT',
    'VIEW_AUDIT_LOGS',
    'VIEW_ALL_VENDORS',
    'VIEW_PURCHASE_ORDERS',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (pathname === '/' || pathname === '/login' || pathname === '/vendor/register') {
    return true;
  }

  if (pathname.startsWith('/admin')) {
    return role === 'ADMIN';
  }

  if (pathname.startsWith('/procurement')) {
    return role === 'PROCUREMENT' || role === 'PROCUREMENT_MANAGER';
  }

  if (pathname.startsWith('/finance')) {
    return role === 'FINANCE' || role === 'ADMIN';
  }

  if (pathname.startsWith('/manager')) {
    return role === 'DEPARTMENT_MANAGER';
  }

  if (pathname.startsWith('/vendor')) {
    return role === 'VENDOR';
  }

  if (pathname.startsWith('/auditor')) {
    return role === 'AUDITOR' || role === 'ADMIN';
  }

  return true;
}

export function getDefaultDashboardRoute(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PROCUREMENT':
    case 'PROCUREMENT_MANAGER':
      return '/procurement/dashboard';
    case 'FINANCE':
      return '/finance/dashboard';
    case 'DEPARTMENT_MANAGER':
      return '/manager/dashboard';
    case 'VENDOR':
      return '/vendor/dashboard';
    case 'AUDITOR':
      return '/auditor/dashboard';
    default:
      return '/';
  }
}
