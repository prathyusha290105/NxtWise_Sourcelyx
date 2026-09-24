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
import { Vendor } from '../../../lib/types';
import { Search, Building2, ShieldCheck, X, Eye } from 'lucide-react';

export default function ProcurementVendorsPage() {
  const { vendors, verifyVendor, rejectVendor, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  const [vendorToVerify, setVendorToVerify] = useState<Vendor | null>(null);
  const [vendorToReject, setVendorToReject] = useState<Vendor | null>(null);

  const tabs = [
    { id: 'ALL', label: 'All Suppliers', count: vendors.length },
    {
      id: 'PENDING_VERIFICATION',
      label: 'Pending Verification',
      count: vendors.filter((v) => v.status === 'PENDING_VERIFICATION').length,
    },
    {
      id: 'VERIFIED',
      label: 'Verified (Admin Review)',
      count: vendors.filter((v) => v.status === 'VERIFIED' || v.status === 'PENDING_APPROVAL').length,
    },
    {
      id: 'ACTIVE',
      label: 'Approved / Active',
      count: vendors.filter((v) => v.status === 'ACTIVE').length,
    },
    {
      id: 'REJECTED',
      label: 'Rejected',
      count: vendors.filter((v) => v.status === 'REJECTED').length,
    },
  ];

  const filteredVendors = vendors.filter((v) => {
    let matchesTab = true;
    if (activeTab === 'VERIFIED') {
      matchesTab = v.status === 'VERIFIED' || v.status === 'PENDING_APPROVAL';
    } else if (activeTab !== 'ALL') {
      matchesTab = v.status === activeTab;
    }

    const matchesSearch =
      v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <AppShell
      title="Vendor Onboarding & Verification"
      subtitle="Inspect supplier compliance credentials, audit submitted statutory records, and verify accounts"
    >
      <div className="space-y-4">
        {/* Filter Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search vendor name, GSTIN, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredVendors.length}</strong> suppliers
          </div>
        </div>

        {/* Vendors Table */}
        {filteredVendors.length === 0 ? (
          <EmptyState
            icon={<Building2 className="w-8 h-8 text-slate-400" />}
            title="No suppliers found"
            description="No vendors matched your selected tab or search query."
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Vendor / Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => {
                const canVerify = vendor.status === 'PENDING_VERIFICATION';

                return (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900">{vendor.companyName}</div>
                        <div className="text-[11px] text-slate-400">{vendor.category} • {vendor.businessType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-800">{vendor.contactPerson}</div>
                        <div className="text-slate-500">{vendor.email}</div>
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

                        {canVerify && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setVendorToVerify(vendor)}
                              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                            >
                              Verify
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
        onVerify={(id) => {
          const v = vendors.find((ven) => ven.id === id);
          if (v) setVendorToVerify(v);
        }}
        onReject={(id) => {
          const v = vendors.find((ven) => ven.id === id);
          if (v) setVendorToReject(v);
        }}
        userRole={currentUser.role}
      />

      {/* Verify Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!vendorToVerify}
        onClose={() => setVendorToVerify(null)}
        title="Verify Vendor Documentation"
        message={`Confirm that you have reviewed the GST, PAN, bank mandate, and incorporation credentials for "${vendorToVerify?.companyName}"? Upon verification, this vendor will be forwarded to the Central Admin for final onboarding signoff.`}
        confirmText="Confirm Verification"
        variant="primary"
        onConfirm={() => {
          if (vendorToVerify) {
            verifyVendor(vendorToVerify.id, currentUser.name);
            setVendorToVerify(null);
          }
        }}
      />

      {/* Reject Confirmation Dialog (Requires Reason) */}
      <ConfirmDialog
        isOpen={!!vendorToReject}
        onClose={() => setVendorToReject(null)}
        title="Reject Supplier Registration"
        message={`Are you sure you want to reject the application for "${vendorToReject?.companyName}"? An official rejection reason is mandatory.`}
        confirmText="Reject Application"
        variant="danger"
        requireReason
        reasonLabel="Mandatory Rejection Reason"
        reasonPlaceholder="e.g. Expired bank mandate or mismatch in GST registration address."
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
