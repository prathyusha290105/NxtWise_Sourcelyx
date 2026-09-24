'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { formatINR } from '../../../lib/utils';
import { Wallet, Plus, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function FinanceBudgetsPage() {
  const { budgets } = useApp();

  const totalBudget = budgets.reduce((acc, b) => acc + b.allocatedBudget, 0);
  const totalUtilized = budgets.reduce((acc, b) => acc + b.utilizedBudget, 0);
  const totalCommitted = budgets.reduce((acc, b) => acc + b.committedSpend, 0);
  const totalAvailable = budgets.reduce((acc, b) => acc + b.availableBudget, 0);

  return (
    <AppShell
      title="Departmental Budget Allocations"
      subtitle="Annual fiscal limits, consumption pace, and remaining purchasing power"
      actions={
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => alert('Fiscal budget adjustment modal: Budgets are currently locked for FY 2026-27.')}
        >
          Adjust Budget Allocation
        </Button>
      }
    >
      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Budget Pool</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalBudget)}</div>
          <div className="text-[11px] text-slate-400 mt-1">FY 2026-27 All Departments</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Actual Invoiced</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalUtilized)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Settled payments</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-500 font-semibold uppercase">Committed (POs)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalCommitted)}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">En-route deliveries</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Available Buffer</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalAvailable)}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Ready for PRs</div>
        </Card>
      </div>

      {/* Main Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const totalSpentAndCommitted = b.utilizedBudget + b.committedSpend;
          const pct = Number(((totalSpentAndCommitted / b.allocatedBudget) * 100).toFixed(1));
          return (
            <Card key={b.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-base">{b.departmentName}</div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {b.fiscalYear}
                  </span>
                </div>

                <div className="my-4">
                  <div className="text-xs text-slate-400">Total Allocated Limit</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {formatINR(b.allocatedBudget)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Utilization</span>
                    <span className={pct > 80 ? 'text-rose-600' : 'text-slate-900'}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Direct Invoiced:</span>
                    <span className="font-mono font-medium">{formatINR(b.utilizedBudget)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PO Commitments:</span>
                    <span className="font-mono font-medium text-amber-600">{formatINR(b.committedSpend)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-dashed border-slate-200">
                    <span>Available Liquidity:</span>
                    <span className="font-mono text-indigo-700">{formatINR(b.availableBudget)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => alert(`Department ledger report for ${b.departmentName}`)}
                >
                  View Department PRs
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
