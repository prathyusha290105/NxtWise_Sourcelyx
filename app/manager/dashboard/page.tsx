'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatINR, formatDate } from '../../../lib/utils';
import {
  FileText,
  CheckSquare,
  PlusCircle,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { purchaseRequests, budgets, currentUser } = useApp();

  // Engineering department budget
  const deptBudget = budgets.find((b) => b.departmentId === 'dept-eng') || budgets[0];

  // Requests raised by or belonging to this department
  const deptPRs = purchaseRequests.filter(
    (pr) => pr.departmentId === 'dept-eng' || pr.requestedById === currentUser.id
  );

  const pendingApprovals = deptPRs.filter((pr) => pr.status === 'PENDING_APPROVAL');
  const approvedRequests = deptPRs.filter(
    (pr) => pr.status === 'APPROVED' || pr.status === 'RFQ_CREATED' || pr.status === 'PO_GENERATED'
  );
  const rejectedRequests = deptPRs.filter((pr) => pr.status === 'REJECTED');

  return (
    <AppShell
      title="Engineering Department Procurement"
      subtitle="Manage departmental demand, monitor budget burn rate, and sign off purchase requisitions"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/manager/purchase-requests/new">
            <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create Purchase Request
            </Button>
          </Link>
          <Link href="/manager/approvals">
            <Button size="sm" variant="outline" leftIcon={<CheckSquare className="w-4 h-4" />}>
              Pending Signoffs ({pendingApprovals.length})
            </Button>
          </Link>
        </div>
      }
    >
      {/* Department Budget KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Department Budget</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(deptBudget.allocatedBudget)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{deptBudget.departmentName} FY 26-27</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-500 font-semibold uppercase">Pending Approvals</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{pendingApprovals.length}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Action required</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Approved Requisitions</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{approvedRequests.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready or in RFQ/PO</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Available Buffer</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(deptBudget.availableBudget)}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {deptBudget.utilizationPercentage}% utilized
          </div>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requisitions Awaiting Approval */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <CardTitle>Requisitions Awaiting Your Signoff</CardTitle>
            </div>
            <Link
              href="/manager/approvals"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Review All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {pendingApprovals.slice(0, 4).map((pr) => (
              <div key={pr.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{pr.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {pr.requestNumber} • {formatINR(pr.totalAmount)}
                  </div>
                </div>
                <Link href="/manager/approvals">
                  <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No requisitions are currently pending your approval.
              </div>
            )}
          </div>
        </Card>

        {/* Recent Department Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <CardTitle>Recent Requisitions</CardTitle>
            </div>
            <Link
              href="/manager/purchase-requests"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {deptPRs.slice(0, 4).map((pr) => (
              <div key={pr.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{pr.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {pr.requestNumber} • Created {formatDate(pr.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{formatINR(pr.totalAmount)}</span>
                  <StatusBadge status={pr.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
