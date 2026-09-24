'use client';

import React, { useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { formatINR, formatDate } from '../../../lib/utils';
import { Search, Coins, Download, Filter, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function FinanceSpendPage() {
  const { purchaseOrders, budgets } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const totalCommittedSpend = purchaseOrders.reduce((acc, po) => acc + po.totalAmount, 0);

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.purchaseRequestNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      title="Spend Tracking & Purchase Commitments"
      subtitle="Complete ledger of commercial commitments, tax disbursements, and vendor payments"
      actions={
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => alert('Exporting spend ledger to Excel / CSV format...')}
        >
          Export Spend Report
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search by PO number, supplier, or PR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
            Total Recognized Commitments:{' '}
            <strong className="text-indigo-700 font-mono text-sm">{formatINR(totalCommittedSpend)}</strong>
          </div>
        </div>

        {/* Spend Table */}
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>PO Reference</TableHead>
                <TableHead>Awarded Supplier</TableHead>
                <TableHead>Requisition Ref</TableHead>
                <TableHead className="text-right">Taxable Subtotal</TableHead>
                <TableHead className="text-right">GST (18%)</TableHead>
                <TableHead className="text-right">Total Payable</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Status</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {po.poNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs">{po.vendorName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">GSTIN: {po.vendorGst}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {po.purchaseRequestNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-600">
                    {formatINR(po.subtotal)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-600">
                    {formatINR(po.taxAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs text-slate-900">
                    {formatINR(po.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500">{formatDate(po.orderDate)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600">{po.paymentTerms}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={po.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
