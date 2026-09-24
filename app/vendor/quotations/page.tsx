'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatINR, formatDate } from '../../../lib/utils';
import { Quotation } from '../../../lib/types';
import { Layers, Eye, SendHorizontal, Trophy, CheckCircle2, FileCheck2 } from 'lucide-react';

export default function VendorQuotationsPage() {
  const { quotations, vendors, currentUser } = useApp();

  const currentVendor =
    vendors.find((v) => v.id === currentUser.vendorId) ||
    vendors.find((v) => v.email === currentUser.email) ||
    vendors[0];

  const vendorQuotes = quotations.filter((q) => q.vendorId === currentVendor.id);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  return (
    <AppShell
      title="Submitted Quotations & Bids"
      subtitle="Track your submitted commercial proposals and award outcomes"
      actions={
        <Link href="/vendor/rfqs">
          <Button size="sm" variant="primary" leftIcon={<SendHorizontal className="w-4 h-4" />}>
            View Open RFQs
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        {vendorQuotes.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-8 h-8 text-slate-400" />}
            title="No quotations submitted"
            description="You haven't submitted any quotations yet. Check your assigned RFQs to submit a bid."
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Quotation No.</TableHead>
                <TableHead>RFQ Reference</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Delivery Lead</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {vendorQuotes.map((quo) => (
                <TableRow key={quo.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      {quo.quotationNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {quo.rfqNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs text-slate-900">
                    {formatINR(quo.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 font-medium">{quo.deliveryDays} Days</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600">{quo.paymentTerms}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500">{formatDate(quo.submittedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={quo.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedQuote(quo)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Details
                      </Button>
                      {quo.status === 'SELECTED' && (
                        <Link href="/vendor/purchase-orders">
                          <Button size="sm" variant="outline" leftIcon={<FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />}>
                            View PO
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Quote Details Modal */}
      <Modal
        isOpen={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        title={selectedQuote?.quotationNumber || 'Quotation Details'}
        description={`Bid for ${selectedQuote?.rfqNumber}`}
        maxWidth="md"
      >
        {selectedQuote && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400">Total Quoted Value</div>
                <div className="text-xl font-black text-indigo-700 font-mono">
                  {formatINR(selectedQuote.totalAmount)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Subtotal: {formatINR(selectedQuote.subtotal)} | Tax: {formatINR(selectedQuote.tax)}
                </div>
              </div>
              <StatusBadge status={selectedQuote.status} />
            </div>

            {selectedQuote.status === 'SELECTED' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Winning Bid!</strong> Your quotation was selected by the procurement committee.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Delivery Lead Time:</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedQuote.deliveryDays} Days</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Payment Terms:</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedQuote.paymentTerms}</div>
              </div>
            </div>

            {selectedQuote.notes && (
              <div className="p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">Proposal Notes:</span>
                <p className="mt-1 text-slate-600 italic">&ldquo;{selectedQuote.notes}&rdquo;</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedQuote(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
