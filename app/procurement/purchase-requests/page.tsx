'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ApprovalTimeline } from '../../../components/ApprovalTimeline';
import { formatINR, formatDate } from '../../../lib/utils';
import { PurchaseRequest } from '../../../lib/types';
import { Search, FileText, SendHorizontal, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProcurementPurchaseRequestsPage() {
  const router = useRouter();
  const { purchaseRequests } = useApp();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);

  const tabs = [
    { id: 'ALL', label: 'All Requests', count: purchaseRequests.length },
    {
      id: 'APPROVED',
      label: 'Ready for RFQ',
      count: purchaseRequests.filter((p) => p.status === 'APPROVED').length,
    },
    {
      id: 'PENDING_APPROVAL',
      label: 'Pending Approval',
      count: purchaseRequests.filter((p) => p.status === 'PENDING_APPROVAL').length,
    },
    {
      id: 'RFQ_CREATED',
      label: 'RFQ Published',
      count: purchaseRequests.filter((p) => p.status === 'RFQ_CREATED').length,
    },
    {
      id: 'PO_GENERATED',
      label: 'PO Issued',
      count: purchaseRequests.filter((p) => p.status === 'PO_GENERATED').length,
    },
  ];

  const filteredPRs = purchaseRequests.filter((pr) => {
    const matchesTab = activeTab === 'ALL' || pr.status === activeTab;
    const matchesSearch =
      pr.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.requestedByName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppShell
      title="Purchase Requisitions Pipeline"
      subtitle="Track incoming departmental demand, signoff progression, and initiate competitive supplier RFQs"
    >
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search request number, title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredPRs.length}</strong> purchase requisitions
          </div>
        </div>

        {filteredPRs.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-slate-400" />}
            title="No purchase requests found"
            description="No requisitions matched your current status filter or search parameters."
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Request No.</TableHead>
                <TableHead>Requisition Title</TableHead>
                <TableHead>Department & Requester</TableHead>
                <TableHead className="text-right">Total Est.</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Approval Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPRs.map((pr) => {
                const canCreateRFQ = pr.status === 'APPROVED';

                return (
                  <TableRow key={pr.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {pr.requestNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-xs max-w-xs truncate" title={pr.title}>
                        {pr.title}
                      </div>
                      <div className="text-[11px] text-slate-400">Needed by: {formatDate(pr.requiredDate)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-800">{pr.departmentName}</div>
                        <div className="text-slate-500">{pr.requestedByName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-xs text-slate-900">
                      {formatINR(pr.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pr.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-700'
                            : pr.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pr.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600">
                        Tier {pr.currentApprovalLevel} of {pr.totalApprovalLevels}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pr.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPR(pr)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View
                        </Button>
                        {canCreateRFQ && (
                          <Link href={`/procurement/rfqs?createFromPR=${pr.id}`}>
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<SendHorizontal className="w-3.5 h-3.5" />}
                            >
                              Create RFQ
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* PR Detailed Inspection Modal */}
      <Modal
        isOpen={!!selectedPR}
        onClose={() => setSelectedPR(null)}
        title={selectedPR?.requestNumber || 'Requisition Details'}
        description={`Raised by ${selectedPR?.requestedByName} (${selectedPR?.departmentName})`}
        maxWidth="2xl"
      >
        {selectedPR && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Header summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedPR.title}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md">{selectedPR.description}</p>
                <p className="text-xs text-slate-600 mt-1 italic">
                  <strong>Justification:</strong> {selectedPR.justification}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Total Estimated Cost</div>
                <div className="text-xl font-black text-indigo-700 font-mono">
                  {formatINR(selectedPR.totalAmount)}
                </div>
                <div className="mt-1">
                  <StatusBadge status={selectedPR.status} />
                </div>
              </div>
            </div>

            {/* Approval Progression Timeline */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Approval Workflow Progression
              </h5>
              <ApprovalTimeline
                approvals={selectedPR.approvals}
                currentLevel={selectedPR.currentApprovalLevel}
                totalLevels={selectedPR.totalApprovalLevels}
                status={selectedPR.status}
                createdAt={selectedPR.createdAt}
              />
            </div>

            {/* Line items */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Requested Line Items
              </h5>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {selectedPR.items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="font-bold text-slate-900">{it.item}</TableCell>
                      <TableCell className="text-slate-500">{it.description}</TableCell>
                      <TableCell className="text-right">{it.quantity}</TableCell>
                      <TableCell className="text-right font-mono">{formatINR(it.unitPrice)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-slate-900">
                        {formatINR(it.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedPR(null)}>
                Close
              </Button>
              {selectedPR.status === 'APPROVED' && (
                <Link href={`/procurement/rfqs?createFromPR=${selectedPR.id}`}>
                  <Button size="sm" variant="primary" leftIcon={<SendHorizontal className="w-4 h-4" />}>
                    Proceed to Create RFQ
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
