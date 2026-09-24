'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { VendorPerformanceCard } from '../../../components/VendorPerformanceCard';
import { formatINR } from '../../../lib/utils';
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
import { TrendingUp, Clock, Award, ShieldAlert } from 'lucide-react';

export default function ProcurementAnalyticsPage() {
  const { vendors, purchaseOrders, budgets } = useApp();

  const totalPOSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);

  // Spend by vendor
  const vendorSpendMap: Record<string, number> = {};
  purchaseOrders.forEach((po) => {
    vendorSpendMap[po.vendorName] = (vendorSpendMap[po.vendorName] || 0) + po.totalAmount;
  });

  const vendorSpendData = Object.entries(vendorSpendMap).map(([name, spend]) => ({
    name: name.split(' ')[0], // shortened
    spend,
  }));

  // Spend by category
  const categoryData = [
    { name: 'Hardware & Systems', value: 450000, color: '#4f46e5' },
    { name: 'Cloud & SaaS', value: 250000, color: '#06b6d4' },
    { name: 'Office Supplies', value: 85000, color: '#f59e0b' },
    { name: 'Networking', value: 120000, color: '#10b981' },
  ];

  return (
    <AppShell
      title="Procurement & Supplier Intelligence"
      subtitle="Strategic telemetry on supplier performance ratings, delivery efficiency, and category spend"
    >
      {/* Top Sourcing KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Committed Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalPOSpend)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across approved purchase contracts</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Avg Vendor Rating</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4.6 / 5.0</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">94% On-time delivery SLA</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Avg Turnaround Time</div>
          <div className="text-2xl font-black text-slate-900 mt-1">6.4 Days</div>
          <div className="text-[11px] text-slate-400 mt-1">From PR creation to PO dispatch</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-purple-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Cost Avoidance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹1,84,000</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Via competitive RFQ bidding</div>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Spend by Top Certified Supplier</CardTitle>
              <p className="text-xs text-slate-400">Total volume of purchase orders by vendor</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSpendData.length > 0 ? vendorSpendData : [{ name: 'Techtron', spend: 500000 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
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
              <CardTitle>Category Spend Breakdown</CardTitle>
              <p className="text-xs text-slate-400">Procurement budget allocation by supply stream</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [formatINR(val), name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Supplier Performance Scorecards */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Active Supplier Scorecards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors
            .filter((v) => v.status === 'ACTIVE')
            .map((ven) => (
              <VendorPerformanceCard
                key={ven.id}
                performance={ven.performance}
                vendorName={ven.companyName}
              />
            ))}
        </div>
      </div>
    </AppShell>
  );
}
