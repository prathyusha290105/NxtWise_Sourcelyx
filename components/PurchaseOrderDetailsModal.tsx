'use client';

import React from 'react';
import { PurchaseOrder } from '../lib/types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { formatINR, formatDate } from '../lib/utils';
import { Printer, Send, CheckCircle, FileText, Building2, MapPin, Calendar, CreditCard } from 'lucide-react';

export interface PurchaseOrderDetailsModalProps {
  po: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: (poId: string) => void;
  onAcknowledge?: (poId: string) => void;
  userRole?: string;
}

export const PurchaseOrderDetailsModal: React.FC<PurchaseOrderDetailsModalProps> = ({
  po,
  isOpen,
  onClose,
  onSend,
  onAcknowledge,
  userRole,
}) => {
  if (!po) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Purchase Order: ${po.poNumber}`}
      description={`Official Commercial Purchase Order • Generated on ${formatDate(po.orderDate)}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-sm text-slate-800" id="printable-po">
        {/* PO Header Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
              Sourcelyx Enterprise Procurement
            </div>
            <div className="text-xl font-black mt-0.5">{po.poNumber}</div>
            <div className="text-xs text-slate-400 mt-1">
              Ref PR: {po.purchaseRequestNumber} | Ref RFQ: {po.rfqNumber} | Ref Quote: {po.quotationNumber}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={po.status} />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Print / PDF
            </Button>
          </div>
        </div>

        {/* Addresses & Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vendor Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Vendor (Supplier)
            </div>
            <div className="font-bold text-slate-900 text-base">{po.vendorName}</div>
            <div className="text-xs text-slate-600 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>{po.vendorAddress}</span>
            </div>
            <div className="text-xs text-slate-600 font-mono">
              <span className="font-sans text-slate-400">GSTIN:</span> {po.vendorGst}
            </div>
          </div>

          {/* Delivery & Billing */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Delivery Destination & Terms
            </div>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              {po.deliveryAddress}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Target Delivery:
                </span>
                <span className="font-semibold text-slate-900">{formatDate(po.deliveryDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  Payment Terms:
                </span>
                <span className="font-semibold text-slate-900">{po.paymentTerms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Item & Description</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {po.items.map((it, idx) => (
                <tr key={it.id || idx}>
                  <td className="p-3 text-xs text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{it.item}</div>
                    <div className="text-xs text-slate-500">{it.description}</div>
                  </td>
                  <td className="p-3 text-right font-medium">{it.quantity}</td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    {formatINR(it.unitPrice)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(it.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 max-w-sm">
            <div className="font-bold text-slate-700">Contract Instructions:</div>
            <div>{po.notes || 'Goods subject to inspection upon receipt before acceptance.'}</div>
            <div className="mt-1 text-slate-400">Issued by: {po.createdByName}</div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatINR(po.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST / Taxes ({po.taxRate}%):</span>
              <span className="font-mono font-medium">{formatINR(po.taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between text-base font-black text-slate-900">
              <span>Total PO Value:</span>
              <span className="font-mono text-indigo-700">{formatINR(po.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          {/* Send PO button (Procurement only) */}
          {(userRole === 'PROCUREMENT' || userRole === 'PROCUREMENT_MANAGER') &&
            po.status === 'GENERATED' &&
            onSend && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => {
                  onSend(po.id);
                  onClose();
                }}
              >
                Dispatch to Vendor
              </Button>
            )}

          {/* Vendor Acknowledge PO button */}
          {userRole === 'VENDOR' && po.status === 'SENT' && onAcknowledge && (
            <Button
              variant="success"
              size="sm"
              leftIcon={<CheckCircle className="w-4 h-4" />}
              onClick={() => {
                onAcknowledge(po.id);
                onClose();
              }}
            >
              Acknowledge Purchase Order
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
