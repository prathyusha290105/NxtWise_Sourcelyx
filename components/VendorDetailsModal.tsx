'use client';

import React from 'react';
import { Vendor } from '../lib/types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { formatDate } from '../lib/utils';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Star,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export interface VendorDetailsModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (vendorId: string) => void;
  onApprove?: (vendorId: string) => void;
  onReject?: (vendorId: string) => void;
  userRole?: string;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({
  vendor,
  isOpen,
  onClose,
  onVerify,
  onApprove,
  onReject,
  userRole,
}) => {
  if (!vendor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendor.companyName}
      description={`Vendor ID: ${vendor.id} • Registered ${formatDate(vendor.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-sm">
        {/* Top Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <StatusBadge status={vendor.status} />
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {vendor.businessType}
            </span>
            {vendor.category && (
              <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {vendor.category}
              </span>
            )}
          </div>

          {vendor.performance && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{vendor.performance.overallRating} / 5.0 Rating</span>
            </div>
          )}
        </div>

        {vendor.rejectionReason && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            <strong>Rejection Reason:</strong> {vendor.rejectionReason}
          </div>
        )}

        {/* Company & Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 space-y-2.5 bg-white">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Primary Contact & Office
            </h4>
            <div>
              <div className="text-xs text-slate-500">Contact Person</div>
              <div className="font-semibold text-slate-900">{vendor.contactPerson}</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{vendor.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 space-y-2.5 bg-white">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              Tax & Bank Credentials
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">GST Number:</span>
                <div className="font-mono font-semibold text-slate-900">{vendor.gstNumber}</div>
              </div>
              <div>
                <span className="text-slate-500">PAN Number:</span>
                <div className="font-mono font-semibold text-slate-900">{vendor.panNumber}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Bank Name:</span>{' '}
                <span className="font-semibold text-slate-900">{vendor.bankName}</span>
              </div>
              <div>
                <span className="text-slate-500">Account No:</span>{' '}
                <span className="font-mono font-semibold text-slate-900">{vendor.bankAccount}</span>
              </div>
              <div>
                <span className="text-slate-500">IFSC Code:</span>{' '}
                <span className="font-mono font-semibold text-slate-900">{vendor.ifscCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Approval Timeline info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500">Procurement Verification:</span>
            <div className="font-medium text-slate-800 mt-0.5">
              {vendor.verifiedAt
                ? `Verified on ${formatDate(vendor.verifiedAt)} by ${vendor.verifiedBy || 'Procurement'}`
                : 'Pending Verification'}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Admin Final Approval:</span>
            <div className="font-medium text-slate-800 mt-0.5">
              {vendor.approvedAt
                ? `Approved on ${formatDate(vendor.approvedAt)} by ${vendor.approvedBy || 'Admin'}`
                : 'Pending Final Admin Approval'}
            </div>
          </div>
        </div>

        {/* Submitted Documents Section */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            Statutory Compliance Documents ({vendor.documents.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vendor.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/70"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 truncate">{doc.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {doc.type.replace('_', ' ')} • {doc.fileSize}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.verified ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                      Pending
                    </span>
                  )}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Viewing mock document: ${doc.name}`);
                    }}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    title="View Document"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls for Workflow */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          {/* Procurement Verify Action */}
          {(userRole === 'PROCUREMENT' || userRole === 'PROCUREMENT_MANAGER') &&
            vendor.status === 'PENDING_VERIFICATION' &&
            onVerify && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => {
                  onVerify(vendor.id);
                  onClose();
                }}
              >
                Verify Documents
              </Button>
            )}

          {/* Admin Final Approval Action */}
          {userRole === 'ADMIN' && vendor.status === 'PENDING_APPROVAL' && onApprove && (
            <Button
              variant="success"
              size="sm"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={() => {
                onApprove(vendor.id);
                onClose();
              }}
            >
              Approve Vendor
            </Button>
          )}

          {/* Reject Action */}
          {(userRole === 'ADMIN' || userRole === 'PROCUREMENT' || userRole === 'PROCUREMENT_MANAGER') &&
            (vendor.status === 'PENDING_VERIFICATION' || vendor.status === 'PENDING_APPROVAL') &&
            onReject && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<X className="w-4 h-4" />}
                onClick={() => {
                  onReject(vendor.id);
                  onClose();
                }}
              >
                Reject Application
              </Button>
            )}
        </div>
      </div>
    </Modal>
  );
};
