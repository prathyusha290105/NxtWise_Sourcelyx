'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatDate } from '../../../lib/utils';
import { Building2, Mail, Phone, MapPin, CreditCard, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function VendorProfilePage() {
  const { vendors, currentUser } = useApp();

  const currentVendor =
    vendors.find((v) => v.id === currentUser.vendorId) ||
    vendors.find((v) => v.email === currentUser.email) ||
    vendors[0];

  return (
    <AppShell
      title="Company Profile & Compliance"
      subtitle="Registered legal entity, contact channels, and banking coordinates"
      actions={
        <Link href="/vendor/documents">
          <Button size="sm" variant="outline" leftIcon={<FileText className="w-4 h-4" />}>
            Statutory Document Vault ({currentVendor.documents.length})
          </Button>
        </Link>
      }
    >
      <div className="max-w-4xl space-y-6">
        {/* Verification Status Card */}
        <Card className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
              Onboarding Lifecycle Status
            </div>
            <div className="text-xl font-black text-white mt-0.5">{currentVendor.companyName}</div>
            <div className="text-xs text-slate-400 mt-1">
              Registered on {formatDate(currentVendor.createdAt)} • Category: {currentVendor.category}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={currentVendor.status} />
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Office & Contact */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Corporate Headquarters
            </h3>

            <div>
              <div className="text-xs text-slate-400">Legal Business Type</div>
              <div className="text-sm font-semibold text-slate-900">{currentVendor.businessType}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Designated Contact Officer</div>
              <div className="text-sm font-semibold text-slate-900">{currentVendor.contactPerson}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentVendor.email}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentVendor.phone}</span>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                {currentVendor.address}, {currentVendor.city}, {currentVendor.state} -{' '}
                {currentVendor.pincode}
              </span>
            </div>
          </Card>

          {/* Tax & Banking */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Tax & Statutory Mandate
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">GSTIN:</span>
                <div className="font-mono font-bold text-slate-900 text-sm">{currentVendor.gstNumber}</div>
              </div>
              <div>
                <span className="text-slate-400">PAN Number:</span>
                <div className="font-mono font-bold text-slate-900 text-sm">{currentVendor.panNumber}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Settlement Bank:</span>
                <div className="font-semibold text-slate-900">{currentVendor.bankName}</div>
              </div>
              <div>
                <span className="text-slate-400">Account Number:</span>
                <div className="font-mono font-semibold text-slate-900">{currentVendor.bankAccount}</div>
              </div>
              <div>
                <span className="text-slate-400">IFSC Code:</span>
                <div className="font-mono font-semibold text-slate-900">{currentVendor.ifscCode}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
