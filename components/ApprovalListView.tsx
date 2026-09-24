'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/AppContext';
import { PurchaseRequest, Role } from '../lib/types';
import { canUserApproveAtStep } from '../lib/approvalRules';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { StatusBadge } from './ui/StatusBadge';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/Table';
import { EmptyState } from './ui/EmptyState';
import { ApprovalTimeline } from './ApprovalTimeline';
import { formatINR, formatDate } from '../lib/utils';
import { Check, X, RotateCcw, Eye, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const ApprovalListView: React.FC<{ roleContext: Role }> = ({ roleContext }) => {
  const {
    purchaseRequests,
    currentUser,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    sendBackPurchaseRequest,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);

  // Dialog states
  const [prToApprove, setPrToApprove] = useState<PurchaseRequest | null>(null);
  const [prToReject, setPrToReject] = useState<PurchaseRequest | null>(null);
  const [prToSendBack, setPrToSendBack] = useState<PurchaseRequest | null>(null);

  // Filter requests that require action from this role
  const pendingRequestsForRole = purchaseRequests.filter((pr) => {
    if (pr.status !== 'PENDING_APPROVAL') return false;
    return canUserApproveAtStep(roleContext, pr.currentApprovalLevel, pr.approvals);
  });

  const filteredRequests = pendingRequestsForRole.filter(
    (pr) =>
      pr.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.requestedByName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar & Summary Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search pending requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <strong>{filteredRequests.length}</strong> items awaiting your approval
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
          title="Approval queue is clear"
          description={`No pending purchase requisitions currently require signoff for the ${roleContext.replace(
            '_',
            ' '
          )} role.`}
        />
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Request No.</TableHead>
              <TableHead>Requisition Title</TableHead>
              <TableHead>Requester & Dept</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Current Level</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((pr) => (
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
                    <div className="font-medium text-slate-800">{pr.requestedByName}</div>
                    <div className="text-slate-500">{pr.departmentName}</div>
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
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Tier {pr.currentApprovalLevel} of {pr.totalApprovalLevels}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500">{formatDate(pr.createdAt)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedPR(pr)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => setPrToApprove(pr)}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPrToSendBack(pr)}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
                    >
                      Send Back
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setPrToReject(pr)}
                      leftIcon={<X className="w-3.5 h-3.5" />}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedPR}
        onClose={() => setSelectedPR(null)}
        title={selectedPR?.requestNumber || 'Purchase Requisition'}
        description={`Level ${selectedPR?.currentApprovalLevel} Review • Amount: ${formatINR(
          selectedPR?.totalAmount || 0
        )}`}
        maxWidth="2xl"
      >
        {selectedPR && (
          <div className="space-y-6 text-xs text-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">{selectedPR.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{selectedPR.description}</p>
              <div className="mt-2 text-xs">
                <strong>Business Justification:</strong> {selectedPR.justification}
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
              <Button
                size="sm"
                variant="success"
                onClick={() => {
                  const pr = selectedPR;
                  setSelectedPR(null);
                  setPrToApprove(pr);
                }}
              >
                Approve Request
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!prToApprove}
        onClose={() => setPrToApprove(null)}
        title="Approve Purchase Request"
        message={`Approve purchase request ${prToApprove?.requestNumber} for ${formatINR(
          prToApprove?.totalAmount || 0
        )}? If this is the final required tier, it will be marked as APPROVED and forwarded for RFQ creation.`}
        confirmText="Confirm Approval"
        variant="success"
        requireReason={false}
        onConfirm={(comments) => {
          if (prToApprove) {
            approvePurchaseRequest(prToApprove.id, comments);
            setPrToApprove(null);
          }
        }}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!prToReject}
        onClose={() => setPrToReject(null)}
        title="Reject Purchase Request"
        message={`Reject purchase request ${prToReject?.requestNumber}? Please provide a clear rejection reason for the requesting department.`}
        confirmText="Reject Request"
        variant="danger"
        requireReason
        reasonLabel="Rejection Reason"
        reasonPlaceholder="e.g. Budget ceiling reached or duplicate software licensing requested."
        onConfirm={(reason) => {
          if (prToReject && reason) {
            rejectPurchaseRequest(prToReject.id, reason);
            setPrToReject(null);
          }
        }}
      />

      {/* Send Back Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!prToSendBack}
        onClose={() => setPrToSendBack(null)}
        title="Send Back for Revision"
        message={`Send back ${prToSendBack?.requestNumber} to the requester for clarification or cost re-estimation?`}
        confirmText="Send Back"
        variant="primary"
        requireReason
        reasonLabel="Revision Instructions / Comments"
        reasonPlaceholder="e.g. Please provide revised quantity specifications or verify with team."
        onConfirm={(comments) => {
          if (prToSendBack && comments) {
            sendBackPurchaseRequest(prToSendBack.id, comments);
            setPrToSendBack(null);
          }
        }}
      />
    </div>
  );
};
