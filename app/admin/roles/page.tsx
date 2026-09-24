'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { ROLE_PERMISSIONS, Permission } from '../../../lib/permissions';
import { Role } from '../../../lib/types';
import { Shield, Check, X } from 'lucide-react';

export default function AdminRolesPage() {
  const roles: Role[] = [
    'ADMIN',
    'PROCUREMENT',
    'PROCUREMENT_MANAGER',
    'FINANCE',
    'DEPARTMENT_MANAGER',
    'VENDOR',
    'AUDITOR',
  ];

  const permissionsList: { key: Permission; label: string; module: string }[] = [
    { key: 'VIEW_ADMIN_DASHBOARD', label: 'View Administration Console', module: 'Administration' },
    { key: 'MANAGE_USERS', label: 'Manage Users & Permissions', module: 'Administration' },
    { key: 'APPROVE_VENDOR_FINAL', label: 'Final Vendor Approval', module: 'Vendors' },
    { key: 'VERIFY_VENDOR', label: 'Procurement Document Verification', module: 'Vendors' },
    { key: 'VIEW_ALL_VENDORS', label: 'View Comprehensive Vendor Registry', module: 'Vendors' },
    { key: 'CREATE_PURCHASE_REQUEST_DEPT', label: 'Raise Department Purchase Requisitions', module: 'Procurement' },
    { key: 'APPROVE_PURCHASE_REQUEST_DEPT', label: 'Level 1 Department Approval (≤ ₹25k+)', module: 'Approvals' },
    { key: 'APPROVE_PURCHASE_REQUEST_PROCUREMENT', label: 'Level 2 Procurement Manager Approval (₹25k–₹1L)', module: 'Approvals' },
    { key: 'APPROVE_PURCHASE_REQUEST_FINANCE', label: 'Level 3 Finance Signoff (> ₹1L)', module: 'Approvals' },
    { key: 'CREATE_RFQ', label: 'Publish RFQs to Suppliers', module: 'RFQ' },
    { key: 'VIEW_ALL_QUOTATIONS', label: 'Inspect Competitive Vendor Bids', module: 'Quotations' },
    { key: 'COMPARE_QUOTATIONS', label: 'Perform Side-by-Side Quotation Analysis', module: 'Quotations' },
    { key: 'SELECT_VENDOR_QUOTATION', label: 'Award Selected Quotation', module: 'Quotations' },
    { key: 'GENERATE_PURCHASE_ORDER', label: 'Issue Binding Purchase Orders', module: 'Purchase Orders' },
    { key: 'MANAGE_BUDGETS', label: 'Configure Department Budgets & Spend Limits', module: 'Finance' },
    { key: 'VIEW_SPEND_ANALYTICS', label: 'Analyze Real-Time Spend vs Allocated', module: 'Finance' },
    { key: 'SUBMIT_QUOTATION', label: 'Submit Quotation Bids for RFQs', module: 'Vendor Portal' },
    { key: 'VIEW_AUDIT_LOGS', label: 'Audit Trail Inspection (Read-Only)', module: 'Compliance' },
  ];

  return (
    <AppShell
      title="Roles & Permissions Configuration"
      subtitle="Matrix of centralized security capabilities across 7 enterprise personas"
    >
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-3.5 font-bold text-slate-700 min-w-[220px]">Permission Capability</th>
              <th className="p-3.5 font-bold text-slate-500">Module</th>
              {roles.map((r) => (
                <th key={r} className="p-3.5 text-center font-bold text-slate-800">
                  <div className="max-w-[80px] mx-auto truncate" title={r}>
                    {r.replace('_', ' ')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissionsList.map((perm) => (
              <tr key={perm.key} className="hover:bg-slate-50/60">
                <td className="p-3.5 font-semibold text-slate-800">{perm.label}</td>
                <td className="p-3.5 text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">
                    {perm.module}
                  </span>
                </td>
                {roles.map((r) => {
                  const has = ROLE_PERMISSIONS[r]?.includes(perm.key);
                  return (
                    <td key={r} className="p-3.5 text-center">
                      {has ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
