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
  Building2,
  FileText,
  SendHorizontal,
  Layers,
  FileCheck2,
  Coins,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
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

export default function ProcurementDashboardPage() {
  const { vendors, purchaseRequests, rfqs, quotations, purchaseOrders } = useApp();

  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE').length;
  const pendingVerification = vendors.filter((v) => v.status === 'PENDING_VERIFICATION').length;
  const openRFQs = rfqs.filter((r) => r.status === 'OPEN').length;
  const submittedQuotes = quotations.filter((q) => q.status === 'SUBMITTED').length;
  const totalSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);

  const monthlySpendData = [
    { month: 'May', spend: 210000 },
    { month: 'Jun', spend: 340000 },
    { month: 'Jul', spend: 290000 },
    { month: 'Aug', spend: 520000 },
    { month: 'Sep', spend: totalSpend },
  ];

  const rfqPieData = [
    { name: 'Open Bidding', value: rfqs.filter((r) => r.status === 'OPEN').length, color: '#3b82f6' },
    { name: 'Awarded', value: rfqs.filter((r) => r.status === 'AWARDED').length, color: '#10b981' },
    { name: 'Closed', value: rfqs.filter((r) => r.status === 'CLOSED').length, color: '#94a3b8' },
  ].filter((d) => d.value > 0);

  return (
    <AppShell
      title="Procurement Operations Hub"
      subtitle="Sourcing execution, vendor verification, RFQ dispatch, and purchase order tracking"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/procurement/rfqs">
            <Button size="sm" variant="primary" leftIcon={<SendHorizontal className="w-4 h-4" />}>
              Create New RFQ
            </Button>
          </Link>
          <Link href="/procurement/quotations">
            <Button size="sm" variant="outline" leftIcon={<Layers className="w-4 h-4" />}>
              Evaluate Quotations
            </Button>
          </Link>
        </div>
      }
    >
      {/* Top KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="p-3.5 bg-white border-l-4 border-l-emerald-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Active Vendors</div>
          <div className="text-xl font-black text-slate-900 mt-1">{activeVendors}</div>
        </Card>

        <Card className="p-3.5 bg-white border-l-4 border-l-amber-500">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Verif.</div>
          <div className="text-xl font-black text-slate-900 mt-1">{pendingVerification}</div>
        </Card>

        <Card className="p-3.5 bg-white border-l-4 border-l-blue-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Open RFQs</div>
          <div className="text-xl font-black text-slate-900 mt-1">{openRFQs}</div>
        </Card>

        <Card className="p-3.5 bg-white border-l-4 border-l-indigo-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Quotes Inflow</div>
          <div className="text-xl font-black text-slate-900 mt-1">{submittedQuotes}</div>
        </Card>

        <Card className="p-3.5 bg-white border-l-4 border-l-purple-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Purchase Orders</div>
          <div className="text-xl font-black text-slate-900 mt-1">{purchaseOrders.length}</div>
        </Card>

        <Card className="p-3.5 bg-white border-l-4 border-l-rose-500">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total PO Value</div>
          <div className="text-lg font-black text-slate-900 mt-1 truncate">{formatINR(totalSpend)}</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Procurement Spend Flow</CardTitle>
              <p className="text-xs text-slate-400">Total volume of purchase orders generated monthly</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              Monthly Trend
            </span>
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
                  formatter={(val: number) => [formatINR(val), 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="spend" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>RFQ Pipeline Distribution</CardTitle>
              <p className="text-xs text-slate-400">Current status of RFQ requests</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rfqPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {rfqPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} RFQs`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Operational Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Vendor Verification Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <CardTitle>Vendors Pending Statutory Verification</CardTitle>
            </div>
            <Link
              href="/procurement/vendors"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {vendors
              .filter((v) => v.status === 'PENDING_VERIFICATION')
              .slice(0, 3)
              .map((ven) => (
                <div key={ven.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{ven.companyName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      GSTIN: {ven.gstNumber} • {ven.documents.length} Docs
                    </div>
                  </div>
                  <Link href="/procurement/vendors">
                    <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                      Verify Docs
                    </Button>
                  </Link>
                </div>
              ))}
            {vendors.filter((v) => v.status === 'PENDING_VERIFICATION').length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                All submitted vendor dossiers have been verified.
              </p>
            )}
          </div>
        </Card>

        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SendHorizontal className="w-4 h-4 text-indigo-600" />
              <CardTitle>Active RFQ Bidding</CardTitle>
            </div>
            <Link
              href="/procurement/rfqs"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage RFQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {rfqs.slice(0, 3).map((rfq) => (
              <div key={rfq.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {rfq.rfqNumber}: {rfq.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {rfq.quotationCount} Quotes Received • Deadline: {formatDate(rfq.deadline)}
                  </div>
                </div>
                <StatusBadge status={rfq.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
