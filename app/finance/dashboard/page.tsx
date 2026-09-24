'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { formatINR } from '../../../lib/utils';
import {
  Wallet,
  Coins,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  PieChart as PieIcon,
  ShieldAlert,
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

export default function FinanceDashboardPage() {
  const { budgets, purchaseOrders } = useApp();

  const totalBudget = budgets.reduce((acc, b) => acc + b.allocatedBudget, 0);
  const totalUtilized = budgets.reduce((acc, b) => acc + b.utilizedBudget, 0);
  const totalCommitted = budgets.reduce((acc, b) => acc + b.committedSpend, 0);
  const totalAvailable = budgets.reduce((acc, b) => acc + b.availableBudget, 0);

  // Department spend comparison chart
  const departmentChartData = budgets.map((b) => ({
    name: b.departmentName.split(' ')[0],
    Allocated: b.allocatedBudget,
    Utilized: b.utilizedBudget + b.committedSpend,
    Available: b.availableBudget,
  }));

  const monthlySpendData = [
    { month: 'May 26', spend: 320000 },
    { month: 'Jun 26', spend: 480000 },
    { month: 'Jul 26', spend: 410000 },
    { month: 'Aug 26', spend: 690000 },
    { month: 'Sep 26', spend: totalUtilized + totalCommitted },
  ];

  return (
    <AppShell
      title="Financial Governance & Spend Control"
      subtitle="Department budget allocations, committed contract liabilities, and spend compliance"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/finance/budgets">
            <Button size="sm" variant="outline" leftIcon={<Wallet className="w-4 h-4" />}>
              Budget Allocations
            </Button>
          </Link>
          <Link href="/finance/spend">
            <Button size="sm" variant="primary" leftIcon={<Coins className="w-4 h-4" />}>
              Spend Ledger
            </Button>
          </Link>
        </div>
      }
    >
      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Allocated Budget</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalBudget)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Annual FY 2026-27 Pool</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Utilized Invoices</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalUtilized)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {((totalUtilized / totalBudget) * 100).toFixed(1)}% of total pool
          </div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-500 font-semibold uppercase">Committed PO Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalCommitted)}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Active PO commitments</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Available Liquidity</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalAvailable)}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Unencumbered headroom</div>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Department Budget Allocation vs Utilization</CardTitle>
              <p className="text-xs text-slate-400">Allocated limit vs combined utilized & committed spend</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${val / 100000}L`}
                />
                <Tooltip
                  formatter={(val: number) => [formatINR(val)]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Allocated" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Utilized" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly Spend Trend</CardTitle>
              <p className="text-xs text-slate-400">Cash outflow timeline across departments</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${val / 100000}L`}
                />
                <Tooltip
                  formatter={(val: number) => [formatINR(val), 'Monthly Spend']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="spend" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department Budget Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departmental Budget Ledger (FY 2026-27)</CardTitle>
          <Link href="/finance/budgets" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
            <span>Detailed View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <Table>
          <TableHeader>
            <tr>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Allocated</TableHead>
              <TableHead className="text-right">Utilized</TableHead>
              <TableHead className="text-right">Committed</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead>Utilization %</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {budgets.map((b) => {
              const utilPct = Number(
                (((b.utilizedBudget + b.committedSpend) / b.allocatedBudget) * 100).toFixed(1)
              );
              return (
                <TableRow key={b.id}>
                  <TableCell className="font-bold text-slate-900">{b.departmentName}</TableCell>
                  <TableCell className="text-right font-mono text-slate-700">
                    {formatINR(b.allocatedBudget)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-700">
                    {formatINR(b.utilizedBudget)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-700">
                    {formatINR(b.committedSpend)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-indigo-700">
                    {formatINR(b.availableBudget)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            utilPct > 80 ? 'bg-rose-500' : utilPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, utilPct)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{utilPct}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </AppShell>
  );
}
