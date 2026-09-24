'use client';

import React, { useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatINR, formatDate } from '../../../lib/utils';
import { RFQ } from '../../../lib/types';
import { SendHorizontal, Check, Clock, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function VendorRFQsPage() {
  const { rfqs, purchaseRequests, vendors, submitQuotation, currentUser } = useApp();

  const currentVendor =
    vendors.find((v) => v.id === currentUser.vendorId) ||
    vendors.find((v) => v.email === currentUser.email) ||
    vendors[0];

  // Vendor can ONLY see RFQs assigned to that vendor!
  const assignedRFQs = rfqs.filter((r) =>
    r.invitedVendors.some((iv) => iv.vendorId === currentVendor.id)
  );

  // Quotation Submission Modal State
  const [selectedRFQForQuote, setSelectedRFQForQuote] = useState<RFQ | null>(null);
  const [unitPrice, setUnitPrice] = useState<number>(70000);
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30 days');
  const [validUntil, setValidUntil] = useState<string>('2026-10-25');
  const [notes, setNotes] = useState<string>('Includes 3 years manufacturer warranty.');

  const subtotal = Number(unitPrice) * Number(quantity);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const totalAmount = subtotal + tax;

  const handleOpenQuoteModal = (rfq: RFQ) => {
    setSelectedRFQForQuote(rfq);
    const relatedPR = purchaseRequests.find((p) => p.id === rfq.purchaseRequestId);
    if (relatedPR && relatedPR.items.length > 0) {
      setUnitPrice(relatedPR.items[0].unitPrice);
      setQuantity(relatedPR.items[0].quantity);
    }
    const d = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    setValidUntil(d);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRFQForQuote) return;

    const relatedPR = purchaseRequests.find((p) => p.id === selectedRFQForQuote.purchaseRequestId);
    const itemName = relatedPR?.items[0]?.item || selectedRFQForQuote.title;

    submitQuotation({
      rfqId: selectedRFQForQuote.id,
      rfqNumber: selectedRFQForQuote.rfqNumber,
      vendorId: currentVendor.id,
      vendorName: currentVendor.companyName,
      items: [
        {
          id: `qi-${Date.now()}`,
          item: itemName,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          total: subtotal,
        },
      ],
      unitPrice: Number(unitPrice),
      quantity: Number(quantity),
      subtotal,
      tax,
      totalAmount,
      deliveryDays: Number(deliveryDays),
      paymentTerms,
      validUntil,
      notes,
    });

    setSelectedRFQForQuote(null);
  };

  return (
    <AppShell
      title="Assigned RFQ Bidding Invitations"
      subtitle="Exclusive competitive procurement bids issued to your enterprise by Sourcelyx"
    >
      <div className="space-y-4">
        {assignedRFQs.length === 0 ? (
          <EmptyState
            icon={<SendHorizontal className="w-8 h-8 text-slate-400" />}
            title="No assigned RFQs"
            description="You have no active RFQs assigned to your company at this time."
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>RFQ Number</TableHead>
                <TableHead>Requisition Title</TableHead>
                <TableHead>Submission Deadline</TableHead>
                <TableHead>Delivery Requirement</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Bidding Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {assignedRFQs.map((rfq) => {
                const invite = rfq.invitedVendors.find(
                  (iv) => iv.vendorId === currentVendor.id
                );
                const hasQuoted = invite?.hasQuoted;
                const isOpen = rfq.status === 'OPEN';

                return (
                  <TableRow key={rfq.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rfq.rfqNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs">{rfq.title}</div>
                      <div className="text-[11px] text-slate-400 max-w-xs truncate">{rfq.description}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(rfq.deadline)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-xs text-slate-600 truncate block">
                        {rfq.deliveryRequirements}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600">{rfq.paymentTerms}</span>
                    </TableCell>
                    <TableCell>
                      {hasQuoted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Bid Submitted
                        </span>
                      ) : (
                        <StatusBadge status={rfq.status} />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isOpen && !hasQuoted && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenQuoteModal(rfq)}
                          leftIcon={<SendHorizontal className="w-3.5 h-3.5" />}
                        >
                          Submit Quotation
                        </Button>
                      )}
                      {hasQuoted && (
                        <span className="text-xs text-slate-400 font-medium italic">Under Review</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Submit Quotation Modal */}
      <Modal
        isOpen={!!selectedRFQForQuote}
        onClose={() => setSelectedRFQForQuote(null)}
        title={`Submit Commercial Quotation: ${selectedRFQForQuote?.rfqNumber}`}
        description={`Bidding for: ${selectedRFQForQuote?.title}`}
        maxWidth="lg"
      >
        {selectedRFQForQuote && (
          <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Unit Base Price (₹)"
                  type="number"
                  min={1}
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>

            {/* Price calculation readout */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard GST (18%):</span>
                <span className="font-mono font-medium">{formatINR(tax)}</span>
              </div>
              <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Quoted Bid:</span>
                <span className="font-mono text-indigo-700">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Delivery Lead Time (Days)"
                  type="number"
                  min={1}
                  required
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <Input
                  label="Commercial Payment Terms"
                  required
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. Net 30 days"
                />
              </div>
            </div>

            <div>
              <Input
                label="Quotation Validity Expiry"
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <div>
              <Textarea
                label="Warranty & Commercial Terms Notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of warranty, on-site commissioning, SLA..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedRFQForQuote(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit" leftIcon={<Check className="w-4 h-4" />}>
                Submit Official Bid
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </AppShell>
  );
}
