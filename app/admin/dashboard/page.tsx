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
  Users,
  Building2,
  FileText,
  SendHorizontal,
  FileCheck2,
  Coins,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AdminDashboardPage() {
  const {
    users,
    vendors,
    purchaseRequests,
    rfqs,
    purchaseOrders,
    auditLogs,
    budgets,
  } = useApp();

  const totalUsers = users.length;
  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE').length;
  const pendingVendorApprovals = vendors.filter(
    (v) => v.status === 'PENDING_APPROVAL' || v.status === 'PENDING_VERIFICATION'
  ).length;
  const openRFQs = rfqs.filter((r) => r.status === 'OPEN').length;
  const totalPOAmount = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  // Spend Chart Mock Data
  const monthlySpendData = [
    { month: 'May 26', spend: 280000 },
    { month: 'Jun 26', spend: 450000 },
    { month: 'Jul 26', spend: 390000 },
    { month: 'Aug 26', spend: 610000 },
    { month: 'Sep 26', spend: 750500 },
  ];

  // Vendor Status Pie Data
  const vendorStatusData = [
    { name: 'Active', value: vendors.filter((v) => v.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'Pending Verification', value: vendors.filter((v) => v.status === 'PENDING_VERIFICATION').length, color: '#f59e0b' },
    { name: 'Pending Approval', value: vendors.filter((v) => v.status === 'PENDING_APPROVAL').length, color: '#6366f1' },
    { name: 'Rejected', value: vendors.filter((v) => v.status === 'REJECTED').length, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  // PR Pipeline Data
  const prStatusData = [
    { name: 'Pending Approval', count: purchaseRequests.filter((p) => p.status === 'PENDING_APPROVAL').length },
    { name: 'Approved', count: purchaseRequests.filter((p) => p.status === 'APPROVED').length },
    { name: 'RFQ Created', count: purchaseRequests.filter((p) => p.status === 'RFQ_CREATED').length },
    { name: 'PO Issued', count: purchaseRequests.filter((p) => p.status === 'PO_GENERATED').length },
  ];

  return (
    <AppShell
      title="System Administration Overview"
      subtitle="Enterprise system health, vendor compliance, and spend governance KPIs"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/vendors">
            <Button size="sm" variant="outline" leftIcon={<Building2 className="w-4 h-4" />}>
              Review Vendors ({pendingVendorApprovals})
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button size="sm" variant="primary" leftIcon={<Users className="w-4 h-4" />}>
              Manage Users
            </Button>
          </Link>
        </div>
      }
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 7 enterprise roles</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Active Vendors</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeVendors}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {pendingVendorApprovals} pending review
          </div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Open RFQs / POs</span>
            <SendHorizontal className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {openRFQs} <span className="text-sm font-normal text-slate-400">/ {purchaseOrders.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Live competitive bids</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Committed PO Spend</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{formatINR(totalPOAmount)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total issued purchase orders</div>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spend Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Enterprise Spend Velocity</CardTitle>
              <p className="text-xs text-slate-400">Historical authorized spend in Indian Rupees</p>
            </div>
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              FY 2026-27
            </div>
          </CardHeader>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: number) => [formatINR(val), 'Spend']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="spend" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vendor Status Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Supplier Health</CardTitle>
              <p className="text-xs text-slate-400">Vendor onboarding status breakdown</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {vendorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} Vendors`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Two Column Section: Pending Approvals & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Vendor Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <CardTitle>Vendors Awaiting Final Approval</CardTitle>
            </div>
            <Link
              href="/admin/vendors"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {vendors
              .filter((v) => v.status === 'PENDING_APPROVAL' || v.status === 'PENDING_VERIFICATION')
              .slice(0, 4)
              .map((ven) => (
                <div key={ven.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{ven.companyName}</div>
                    <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                      GST: {ven.gstNumber} • {ven.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ven.status} />
                    <Link href="/admin/vendors">
                      <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                        Act
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Recent Audit Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <CardTitle>Real-Time Audit Trail</CardTitle>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-700">{log.userName} ({log.userRole})</span>
                  <span>{formatDate(log.timestamp)}</span>
                </div>
                <div className="text-slate-800 mt-1 font-medium">{log.description}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
