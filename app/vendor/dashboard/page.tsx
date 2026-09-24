'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { VendorPerformanceCard } from '../../../components/VendorPerformanceCard';
import { formatINR, formatDate } from '../../../lib/utils';
import {
  SendHorizontal,
  Layers,
  FileCheck2,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { rfqs, quotations, purchaseOrders, vendors, currentUser } = useApp();

  // Find current vendor profile (default to Techtron ven-1 if demo vendor user)
  const currentVendor =
    vendors.find((v) => v.id === currentUser.vendorId) ||
    vendors.find((v) => v.email === currentUser.email) ||
    vendors[0];

  // RFQs invited to this vendor
  const assignedRFQs = rfqs.filter((r) =>
    r.invitedVendors.some((iv) => iv.vendorId === currentVendor.id)
  );
  const openRFQs = assignedRFQs.filter((r) => r.status === 'OPEN');

  // Quotations submitted by this vendor
  const vendorQuotes = quotations.filter((q) => q.vendorId === currentVendor.id);
  const selectedQuotes = vendorQuotes.filter((q) => q.status === 'SELECTED');

  // Purchase Orders issued to this vendor
  const vendorPOs = purchaseOrders.filter((po) => po.vendorId === currentVendor.id);
  const totalPOValue = vendorPOs.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <AppShell
      title={`Supplier Portal — ${currentVendor.companyName}`}
      subtitle={`Account Status: ${currentVendor.status} • GSTIN: ${currentVendor.gstNumber}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/vendor/rfqs">
            <Button size="sm" variant="primary" leftIcon={<SendHorizontal className="w-4 h-4" />}>
              Active RFQs ({openRFQs.length})
            </Button>
          </Link>
          <Link href="/vendor/profile">
            <Button size="sm" variant="outline" leftIcon={<Building2 className="w-4 h-4" />}>
              Company Profile
            </Button>
          </Link>
        </div>
      }
    >
      {/* Top Supplier KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Invited RFQs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{assignedRFQs.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {openRFQs.length} open for bidding
          </div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-indigo-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Submitted Bids</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{vendorQuotes.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Commercial proposals</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
          <div className="text-xs text-slate-500 font-semibold uppercase">Awarded Bids</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{selectedQuotes.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Winning quotations</div>
        </Card>

        <Card className="p-4 bg-white border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active PO Value</div>
          <div className="text-xl font-black text-slate-900 mt-1">{formatINR(totalPOValue)}</div>
          <div className="text-[11px] text-slate-400 mt-1">{vendorPOs.length} Purchase orders</div>
        </Card>
      </div>

      {/* Two Columns: Open RFQs & Active POs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open RFQs for Bidding */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SendHorizontal className="w-4 h-4 text-blue-600" />
              <CardTitle>Bidding Opportunities (Assigned RFQs)</CardTitle>
            </div>
            <Link
              href="/vendor/rfqs"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {openRFQs.slice(0, 3).map((rfq) => {
              const hasQuoted = rfq.invitedVendors.find(
                (iv) => iv.vendorId === currentVendor.id
              )?.hasQuoted;

              return (
                <div key={rfq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{rfq.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {rfq.rfqNumber} • Deadline: {formatDate(rfq.deadline)}
                    </div>
                  </div>
                  <div>
                    {hasQuoted ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Bid Submitted
                      </span>
                    ) : (
                      <Link href="/vendor/rfqs">
                        <Button size="sm" variant="primary" className="text-xs py-1 px-2.5">
                          Submit Quote
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            {openRFQs.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No active RFQs currently awaiting quotation.
              </div>
            )}
          </div>
        </Card>

        {/* Issued Purchase Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <CardTitle>Received Purchase Orders</CardTitle>
            </div>
            <Link
              href="/vendor/purchase-orders"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {vendorPOs.slice(0, 3).map((po) => (
              <div key={po.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{po.poNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Delivery Target: {formatDate(po.deliveryDate)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{formatINR(po.totalAmount)}</span>
                  <StatusBadge status={po.status} />
                </div>
              </div>
            ))}
            {vendorPOs.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No purchase orders issued yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Supplier Performance Rating */}
      <VendorPerformanceCard
        performance={currentVendor.performance}
        vendorName={currentVendor.companyName}
      />
    </AppShell>
  );
}
