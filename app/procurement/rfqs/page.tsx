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
import { Textarea } from '../../../components/ui/Textarea';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate } from '../../../lib/utils';
import { RFQ } from '../../../lib/types';
import { SendHorizontal, Plus, Search, Eye, Layers, Users, Calendar, Clock, Check } from 'lucide-react';

export default function ProcurementRFQsPage() {
  const formatINR = (amount: number | string | null | undefined) => {
  const value = Number(amount ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};
  const { rfqs, purchaseRequests, vendors, createRFQ, currentUser } = useApp();
  const searchParams = useSearchParams();
  const createFromPRId = searchParams.get('createFromPR');

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRFQForModal, setSelectedRFQForModal] = useState<RFQ | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPRId, setSelectedPRId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deliveryRequirements, setDeliveryRequirements] = useState(
    'Delivery to Bengaluru Central Tech Park within 14 calendar days from PO date.'
  );
  const [paymentTerms, setPaymentTerms] = useState('Net 30 days upon satisfactory inspection.');
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  // Active vendors eligible to be invited (Section 13: Only approved/active vendors can be invited)
  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE');

  // Approved PRs eligible for RFQ
  const eligiblePRs = purchaseRequests.filter(
    (pr) => pr.status === 'APPROVED' || pr.id === createFromPRId
  );

  useEffect(() => {
    if (createFromPRId) {
      const match = purchaseRequests.find((p) => p.id === createFromPRId);
      if (match) {
        setSelectedPRId(match.id);
        setTitle(`RFQ: ${match.title}`);
        setDescription(match.description);
        // Default deadline: 10 days from now
        const d = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
        setDeadline(d);
        // Pre-select active vendors
        setSelectedVendorIds(activeVendors.map((v) => v.id));
        setIsCreateModalOpen(true);
      }
    }
  }, [createFromPRId, purchaseRequests]);

  const handleOpenCreateModal = () => {
    if (eligiblePRs.length > 0) {
      const firstPR = eligiblePRs[0];
      setSelectedPRId(firstPR.id);
      setTitle(`RFQ: ${firstPR.title}`);
      setDescription(firstPR.description);
    }
    const d = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    setDeadline(d);
    setSelectedVendorIds(activeVendors.map((v) => v.id));
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleToggleVendor = (vendorId: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const handleCreateRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPRId) {
      setFormError('Please link an approved Purchase Request.');
      return;
    }
    if (selectedVendorIds.length === 0) {
      setFormError('Please select at least one active supplier to invite.');
      return;
    }

    const pr = purchaseRequests.find((p) => p.id === selectedPRId);
    if (!pr) return;

    const invitedVendors = selectedVendorIds.map((vId) => {
      const ven = vendors.find((v) => v.id === vId);
      return {
        vendorId: vId,
        vendorName: ven?.companyName || 'Supplier',
        contactEmail: ven?.email || 'vendor@example.com',
        invitedAt: new Date().toISOString(),
        hasQuoted: false,
      };
    });

    createRFQ({
      title,
      description,
      purchaseRequestId: pr.id,
      purchaseRequestNumber: pr.requestNumber,
      deadline,
      deliveryRequirements,
      paymentTerms,
      invitedVendors,
      createdBy: currentUser.name,
    });

    setIsCreateModalOpen(false);
  };

  const filteredRFQs = rfqs.filter(
    (r) =>
      r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.purchaseRequestNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      title="Request for Quotations (RFQs)"
      subtitle="Publish competitive bidding opportunities to certified suppliers and collect quotation responses"
      actions={
        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New RFQ
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search RFQ number, title, or PR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredRFQs.length}</strong> RFQs
          </div>
        </div>

        {/* RFQ Table */}
        {filteredRFQs.length === 0 ? (
          <EmptyState
            icon={<SendHorizontal className="w-8 h-8 text-slate-400" />}
            title="No RFQs available"
            description="Create an RFQ from an approved Purchase Request to initiate supplier bidding."
            actionLabel="Create RFQ"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>RFQ Number</TableHead>
                <TableHead>Title & Description</TableHead>
                <TableHead>Linked PR</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Invited Suppliers</TableHead>
                <TableHead>Quotes In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {rfq.rfqNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs max-w-xs truncate" title={rfq.title}>
                      {rfq.title}
                    </div>
                    <div className="text-[11px] text-slate-400">Created: {formatDate(rfq.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {rfq.purchaseRequestNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDate(rfq.deadline)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {rfq.invitedVendors.length} Suppliers
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        rfq.quotationCount > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rfq.quotationCount} Bids
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rfq.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedRFQForModal(rfq)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                      <Link href={`/procurement/quotations?rfq=${rfq.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Layers className="w-3.5 h-3.5 text-indigo-600" />}
                        >
                          Compare Bids
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View RFQ Modal */}
      <Modal
        isOpen={!!selectedRFQForModal}
        onClose={() => setSelectedRFQForModal(null)}
        title={selectedRFQForModal?.rfqNumber || 'RFQ Details'}
        description={`Linked Requisition: ${selectedRFQForModal?.purchaseRequestNumber}`}
        maxWidth="2xl"
      >
        {selectedRFQForModal && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">{selectedRFQForModal.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedRFQForModal.description}</p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400">Deadline:</span>{' '}
                  <span className="font-semibold text-slate-900">{formatDate(selectedRFQForModal.deadline)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Payment Terms:</span>{' '}
                  <span className="font-semibold text-slate-900">{selectedRFQForModal.paymentTerms}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Delivery Requirements:</span>{' '}
                  <span className="font-medium text-slate-800">{selectedRFQForModal.deliveryRequirements}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Invited Approved Suppliers ({selectedRFQForModal.invitedVendors.length})
              </h5>
              <div className="space-y-1.5">
                {selectedRFQForModal.invitedVendors.map((iv) => (
                  <div
                    key={iv.vendorId}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{iv.vendorName}</div>
                      <div className="text-[10px] text-slate-400">{iv.contactEmail}</div>
                    </div>
                    {iv.hasQuoted ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">
                        Quotation Submitted
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                        Awaiting Bid
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedRFQForModal(null)}>
                Close
              </Button>
              <Link href={`/procurement/quotations?rfq=${selectedRFQForModal.id}`}>
                <Button size="sm" variant="primary" leftIcon={<Layers className="w-3.5 h-3.5" />}>
                  View Quotations Matrix
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Create RFQ Modal Form */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish New Request for Quotations (RFQ)"
        description="Select an approved requisition and invite certified suppliers for competitive bidding"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateRFQSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div>
            <Select
              label="Select Approved Purchase Request"
              required
              value={selectedPRId}
              onChange={(e) => {
                const prId = e.target.value;
                setSelectedPRId(prId);
                const pr = purchaseRequests.find((p) => p.id === prId);
                if (pr) {
                  setTitle(`RFQ: ${pr.title}`);
                  setDescription(pr.description);
                }
              }}
              options={
                eligiblePRs.length > 0
                  ? eligiblePRs.map((p) => ({
                      value: p.id,
                      label: `${p.requestNumber} — ${p.title} (${formatINR(p.totalAmount)})`,
                    }))
                  : [{ value: '', label: 'No APPROVED purchase requisitions available' }]
              }
            />
          </div>

          <div>
            <Input
              label="RFQ Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Procurement of Core Network Switches"
            />
          </div>

          <div>
            <Textarea
              label="Detailed Scope of Work & Specs"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include technical specifications, OEM certifications, SLA criteria..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Submission Deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
              label="Delivery Location & Schedule"
              required
              value={deliveryRequirements}
              onChange={(e) => setDeliveryRequirements(e.target.value)}
            />
          </div>

          {/* Suppliers Selection Section */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Invite Active Suppliers ({selectedVendorIds.length} Selected)
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Only active, fully verified and approved vendors are listed below.
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
              {activeVendors.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No active suppliers available. Please approve pending vendors first.
                </div>
              ) : (
                activeVendors.map((ven) => {
                  const isChecked = selectedVendorIds.includes(ven.id);
                  return (
                    <div
                      key={ven.id}
                      onClick={() => handleToggleVendor(ven.id)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{ven.companyName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {ven.category} • GSTIN: {ven.gstNumber}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              leftIcon={<SendHorizontal className="w-4 h-4" />}
            >
              Publish & Dispatch RFQ
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
