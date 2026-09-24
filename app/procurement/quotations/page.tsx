'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { QuotationComparison } from '../../../components/QuotationComparison';
import { formatINR, formatDate } from '../../../lib/utils';
import { Quotation } from '../../../lib/types';
import {
  Layers,
  Search,
  Eye,
  CheckCircle2,
  FileCheck2,
  Calendar,
  Clock,
  CreditCard,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function ProcurementQuotationsPage() {
  const { quotations, rfqs, selectQuotation, currentUser } = useApp();
  const searchParams = useSearchParams();
  const rfqParam = searchParams.get('rfq');

  const [activeTab, setActiveTab] = useState<'LIST' | 'COMPARISON'>('LIST');
  const [selectedRFQId, setSelectedRFQId] = useState<string>(rfqParam || (rfqs.length > 0 ? rfqs[0].id : ''));
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    if (rfqParam) {
      setSelectedRFQId(rfqParam);
      setActiveTab('COMPARISON');
    }
  }, [rfqParam]);

  const currentRFQ = rfqs.find((r) => r.id === selectedRFQId);
  const quotationsForCurrentRFQ = quotations.filter((q) => q.rfqId === selectedRFQId);

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      title="Vendor Quotations & Evaluation Matrix"
      subtitle="Inspect competitive bids received from suppliers, compare commercial terms, and award orders"
      actions={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === 'LIST' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('LIST')}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            All Bids ({quotations.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'COMPARISON' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('COMPARISON')}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Side-by-Side Comparison
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tab 1: All Quotations Table */}
        {activeTab === 'LIST' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:max-w-md">
                <Input
                  placeholder="Search quote number, vendor, or RFQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="text-xs text-slate-500">
                Showing <strong>{filteredQuotations.length}</strong> supplier quotations
              </div>
            </div>

            {filteredQuotations.length === 0 ? (
              <EmptyState
                icon={<Layers className="w-8 h-8 text-slate-400" />}
                title="No quotations found"
                description="No supplier quotations have been received or matched your search."
              />
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Quotation No.</TableHead>
                    <TableHead>RFQ Reference</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Delivery Lead</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quo) => (
                    <TableRow key={quo.id}>
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {quo.quotationNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {quo.rfqNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-900 text-xs">{quo.vendorName}</div>
                        <div className="text-[10px] text-slate-400">
                          Submitted {formatDate(quo.submittedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-xs text-slate-900">
                        {formatINR(quo.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-slate-700">
                          {quo.deliveryDays} Days
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-600">{quo.paymentTerms}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500">{formatDate(quo.validUntil)}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={quo.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingQuotation(quo)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRFQId(quo.rfqId);
                              setActiveTab('COMPARISON');
                            }}
                          >
                            Compare
                          </Button>
                          {quo.status === 'SELECTED' && (
                            <Link href={`/procurement/purchase-orders?generateFromQuote=${quo.id}`}>
                              <Button
                                size="sm"
                                variant="primary"
                                leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                              >
                                Generate PO
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
        )}

        {/* Tab 2: Side-by-Side Comparison Matrix */}
        {activeTab === 'COMPARISON' && (
          <div className="space-y-4">
            {/* RFQ Selector Dropdown */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="w-full sm:max-w-md">
                <Select
                  label="Select RFQ to Evaluate"
                  value={selectedRFQId}
                  onChange={(e) => setSelectedRFQId(e.target.value)}
                  options={rfqs.map((r) => ({
                    value: r.id,
                    label: `${r.rfqNumber}: ${r.title} (${r.quotationCount} Quotes)`,
                  }))}
                />
              </div>

              {quotationsForCurrentRFQ.some((q) => q.status === 'SELECTED') && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Supplier Awarded
                  </span>
                  <Link
                    href={`/procurement/purchase-orders?generateFromQuote=${
                      quotationsForCurrentRFQ.find((q) => q.status === 'SELECTED')?.id
                    }`}
                  >
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<FileCheck2 className="w-4 h-4" />}
                    >
                      Issue Purchase Order
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {currentRFQ ? (
              <QuotationComparison
                rfq={currentRFQ}
                quotations={quotationsForCurrentRFQ}
                onSelectVendor={(quoId, notes) => selectQuotation(quoId, notes)}
                canSelect={true}
              />
            ) : (
              <EmptyState
                icon={<Layers className="w-8 h-8 text-slate-400" />}
                title="No RFQ Selected"
                description="Please select an RFQ to view side-by-side quotations."
              />
            )}
          </div>
        )}
      </div>

      {/* Individual Quotation Modal */}
      <Modal
        isOpen={!!viewingQuotation}
        onClose={() => setViewingQuotation(null)}
        title={viewingQuotation?.quotationNumber || 'Quotation Details'}
        description={`Submitted by ${viewingQuotation?.vendorName} for ${viewingQuotation?.rfqNumber}`}
        maxWidth="lg"
      >
        {viewingQuotation && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400">Total Quoted Amount</div>
                <div className="text-xl font-black text-indigo-700 font-mono">
                  {formatINR(viewingQuotation.totalAmount)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Subtotal: {formatINR(viewingQuotation.subtotal)} | Tax: {formatINR(viewingQuotation.tax)}
                </div>
              </div>
              <StatusBadge status={viewingQuotation.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Delivery Lead Time:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {viewingQuotation.deliveryDays} Calendar Days
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Payment Terms:</span>
                <div className="font-bold text-slate-900 mt-0.5">{viewingQuotation.paymentTerms}</div>
              </div>
              <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400">Proposal Validity:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Valid until {formatDate(viewingQuotation.validUntil)}
                </div>
              </div>
            </div>

            {viewingQuotation.notes && (
              <div className="p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">Vendor Notes:</span>
                <p className="mt-1 text-slate-600 italic">&ldquo;{viewingQuotation.notes}&rdquo;</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setViewingQuotation(null)}>
                Close
              </Button>
              {viewingQuotation.status === 'SUBMITTED' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    const qId = viewingQuotation.id;
                    setViewingQuotation(null);
                    selectQuotation(qId);
                  }}
                >
                  Select This Vendor
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
