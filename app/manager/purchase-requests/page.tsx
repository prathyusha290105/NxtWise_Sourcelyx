'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ApprovalTimeline } from '../../../components/ApprovalTimeline';
import { formatINR, formatDate } from '../../../lib/utils';
import { PurchaseRequest } from '../../../lib/types';
import { PlusCircle, Search, Eye, FileText, ArrowRight } from 'lucide-react';

export default function ManagerPurchaseRequestsPage() {
  const { purchaseRequests, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);

  const filteredPRs = purchaseRequests.filter(
    (pr) =>
      pr.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.requestedByName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      title="Department Purchase Requisitions"
      subtitle="Submit operational procurement requests and track their multi-tier authorization journey"
      actions={
        <Link href="/manager/purchase-requests/new">
          <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Purchase Request
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search request number or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredPRs.length}</strong> requisitions
          </div>
        </div>

        {filteredPRs.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-slate-400" />}
            title="No purchase requests"
            description="You haven't created any purchase requisitions yet."
            actionLabel="Create Purchase Request"
            onAction={() => (window.location.href = '/manager/purchase-requests/new')}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Request No.</TableHead>
                <TableHead>Requisition Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPRs.map((pr) => (
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
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600">{pr.departmentName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600">{pr.requestedByName}</span>
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
                    <StatusBadge status={pr.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500">{formatDate(pr.createdAt)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedPR(pr)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View PR Modal */}
      <Modal
        isOpen={!!selectedPR}
        onClose={() => setSelectedPR(null)}
        title={selectedPR?.requestNumber || 'Requisition Details'}
        description={`Status: ${selectedPR?.status}`}
        maxWidth="2xl"
      >
        {selectedPR && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">{selectedPR.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{selectedPR.description}</p>
              <div className="mt-2 text-xs">
                <strong>Justification:</strong> {selectedPR.justification}
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Approval Chain Status
              </h5>
              <ApprovalTimeline
                approvals={selectedPR.approvals}
                currentLevel={selectedPR.currentApprovalLevel}
                totalLevels={selectedPR.totalApprovalLevels}
                status={selectedPR.status}
                createdAt={selectedPR.createdAt}
              />
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-slate-400 mb-2">Line Items</h5>
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

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedPR(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
