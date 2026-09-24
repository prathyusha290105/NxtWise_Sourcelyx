'use client';

import React, { useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { VendorDetailsModal } from '../../../components/VendorDetailsModal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate } from '../../../lib/utils';
import { Vendor, VendorStatus } from '../../../lib/types';
import { Search, Building2, Check, X, Eye, ShieldCheck, Filter } from 'lucide-react';

export default function AdminVendorsPage() {
  const { vendors, approveVendor, rejectVendor, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  // Rejection confirmation dialog state
  const [vendorToReject, setVendorToReject] = useState<Vendor | null>(null);
  const [vendorToApprove, setVendorToApprove] = useState<Vendor | null>(null);

  const tabs = [
    { id: 'ALL', label: 'All Suppliers', count: vendors.length },
    {
      id: 'PENDING_APPROVAL',
      label: 'Awaiting Admin Approval',
      count: vendors.filter((v) => v.status === 'PENDING_APPROVAL').length,
    },
    {
      id: 'ACTIVE',
      label: 'Active Onboarded',
      count: vendors.filter((v) => v.status === 'ACTIVE').length,
    },
    {
      id: 'PENDING_VERIFICATION',
      label: 'Under Procurement Verification',
      count: vendors.filter((v) => v.status === 'PENDING_VERIFICATION').length,
    },
    {
      id: 'REJECTED',
      label: 'Rejected',
      count: vendors.filter((v) => v.status === 'REJECTED').length,
    },
  ];

  const filteredVendors = vendors.filter((v) => {
    const matchesTab = activeTab === 'ALL' || v.status === activeTab;
    const matchesSearch =
      v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppShell
      title="Supplier Governance & Final Signoff"
      subtitle="Administrative authorization for verified vendors to activate bidding rights"
    >
      <div className="space-y-4">
        {/* Top Filter Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search by company, GSTIN, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredVendors.length}</strong> supplier records
          </div>
        </div>

        {/* Vendors Table */}
        {filteredVendors.length === 0 ? (
          <EmptyState
            icon={<Building2 className="w-8 h-8 text-slate-400" />}
            title="No vendors found"
            description="No supplier records matched your current status filter and search query."
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Company & Contact</TableHead>
                <TableHead>Category / Type</TableHead>
                <TableHead>GSTIN / Tax ID</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead className="text-right">Admin Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => {
                const canApprove = vendor.status === 'PENDING_APPROVAL';

                return (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900">{vendor.companyName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {vendor.contactPerson} • {vendor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-800">{vendor.category || 'General'}</div>
                        <div className="text-slate-400 text-[11px]">{vendor.businessType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {vendor.gstNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{formatDate(vendor.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedVendorForModal(vendor)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View
                        </Button>

                        {canApprove && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => setVendorToApprove(vendor)}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setVendorToReject(vendor)}
                              leftIcon={<X className="w-3.5 h-3.5" />}
                            >
                              Reject
                            </Button>
                          </>
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

      {/* Vendor Full Details Modal */}
      <VendorDetailsModal
        vendor={selectedVendorForModal}
        isOpen={!!selectedVendorForModal}
        onClose={() => setSelectedVendorForModal(null)}
        onApprove={(id) => {
          const v = vendors.find((ven) => ven.id === id);
          if (v) setVendorToApprove(v);
        }}
        onReject={(id) => {
          const v = vendors.find((ven) => ven.id === id);
          if (v) setVendorToReject(v);
        }}
        userRole={currentUser.role}
      />

      {/* Admin Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!vendorToApprove}
        onClose={() => setVendorToApprove(null)}
        title="Approve Supplier Registration"
        message={`Grant final administrative approval to "${vendorToApprove?.companyName}"? Their status will transition to ACTIVE, granting them participation in enterprise RFQs.`}
        confirmText="Confirm & Activate"
        variant="success"
        onConfirm={() => {
          if (vendorToApprove) {
            approveVendor(vendorToApprove.id, currentUser.name);
            setVendorToApprove(null);
          }
        }}
      />

      {/* Admin Reject Confirmation Dialog (Requires Reason) */}
      <ConfirmDialog
        isOpen={!!vendorToReject}
        onClose={() => setVendorToReject(null)}
        title="Reject Supplier Registration"
        message={`Are you sure you want to reject the application for "${vendorToReject?.companyName}"? You must provide an explicit compliance reason.`}
        confirmText="Reject Application"
        variant="danger"
        requireReason
        reasonLabel="Mandatory Rejection Justification"
        reasonPlaceholder="e.g. Discrepancy in GSTIN and active trade license documentation."
        onConfirm={(reason) => {
          if (vendorToReject && reason) {
            rejectVendor(vendorToReject.id, reason, currentUser.name);
            setVendorToReject(null);
          }
        }}
      />
    </AppShell>
  );
}
