'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PurchaseOrderDetailsModal } from '../../../components/PurchaseOrderDetailsModal';
import { formatINR, formatDate } from '../../../lib/utils';
import { PurchaseOrder } from '../../../lib/types';
import {
  FileCheck2,
  Plus,
  Search,
  Eye,
  Send,
  Printer,
  Calendar,
  Building2,
  FileText,
  Clock,
} from 'lucide-react';

export default function ProcurementPurchaseOrdersPage() {
  const {
    purchaseOrders,
    quotations,
    generatePurchaseOrder,
    sendPurchaseOrder,
    currentUser,
  } = useApp();

  const searchParams = useSearchParams();
  const generateFromQuoteId = searchParams.get('generateFromQuote');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedPOForModal, setSelectedPOForModal] = useState<PurchaseOrder | null>(null);

  // Generate PO Modal Form State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Sourcelyx Enterprise Center, Cyber Tech Corridor, Bengaluru - 560103'
  );
  const [paymentTerms, setPaymentTerms] = useState('Net 30 days');
  const [notes, setNotes] = useState('Deliveries accepted between 9 AM to 5 PM Monday-Friday.');

  // Eligible quotations (SELECTED quotations)
  const selectedQuotations = quotations.filter((q) => q.status === 'SELECTED');

  useEffect(() => {
    if (generateFromQuoteId) {
      const match = quotations.find((q) => q.id === generateFromQuoteId);
      if (match) {
        setSelectedQuoteId(match.id);
        setPaymentTerms(match.paymentTerms);
        setIsGenerateModalOpen(true);
      }
    }
  }, [generateFromQuoteId, quotations]);

  const handleOpenGenerateModal = () => {
    if (selectedQuotations.length > 0) {
      const first = selectedQuotations[0];
      setSelectedQuoteId(first.id);
      setPaymentTerms(first.paymentTerms);
    }
    setIsGenerateModalOpen(true);
  };

  const handleGeneratePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteId) return;

    const newPO = generatePurchaseOrder(selectedQuoteId, {
      deliveryAddress,
      paymentTerms,
      notes,
    });

    setIsGenerateModalOpen(false);
    setSelectedPOForModal(newPO);
  };

  const tabs = [
    { id: 'ALL', label: 'All Orders', count: purchaseOrders.length },
    {
      id: 'GENERATED',
      label: 'Draft / Generated',
      count: purchaseOrders.filter((p) => p.status === 'GENERATED').length,
    },
    {
      id: 'SENT',
      label: 'Dispatched to Vendor',
      count: purchaseOrders.filter((p) => p.status === 'SENT').length,
    },
    {
      id: 'ACKNOWLEDGED',
      label: 'Acknowledged',
      count: purchaseOrders.filter((p) => p.status === 'ACKNOWLEDGED').length,
    },
    {
      id: 'COMPLETED',
      label: 'Fulfilled / Completed',
      count: purchaseOrders.filter((p) => p.status === 'COMPLETED').length,
    },
  ];

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesTab = activeTab === 'ALL' || po.status === activeTab;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.purchaseRequestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppShell
      title="Commercial Purchase Orders"
      subtitle="Issue, dispatch, and track binding legal procurement orders to awarded suppliers"
      actions={
        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenGenerateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Generate Purchase Order
        </Button>
      }
    >
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search PO number, supplier, or PR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredPOs.length}</strong> purchase orders
          </div>
        </div>

        {filteredPOs.length === 0 ? (
          <EmptyState
            icon={<FileCheck2 className="w-8 h-8 text-slate-400" />}
            title="No purchase orders found"
            description="Generate a purchase order from an awarded vendor quotation to issue a contract."
            actionLabel="Generate PO"
            onAction={handleOpenGenerateModal}
          />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier / Vendor</TableHead>
                <TableHead>Ref PR & RFQ</TableHead>
                <TableHead className="text-right">Order Amount</TableHead>
                <TableHead>Target Delivery</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      {po.poNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs">{po.vendorName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">GSTIN: {po.vendorGst}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono">
                      <span className="text-indigo-700 font-medium">{po.purchaseRequestNumber}</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-slate-600">{po.rfqNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs text-slate-900">
                    {formatINR(po.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(po.deliveryDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500">{formatDate(po.orderDate)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={po.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPOForModal(po)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                      {po.status === 'GENERATED' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => sendPurchaseOrder(po.id)}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Send
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPOForModal(po);
                          setTimeout(() => window.print(), 200);
                        }}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* PO Full Details / Print Modal */}
      <PurchaseOrderDetailsModal
        po={selectedPOForModal}
        isOpen={!!selectedPOForModal}
        onClose={() => setSelectedPOForModal(null)}
        onSend={(id) => sendPurchaseOrder(id)}
        userRole={currentUser.role}
      />

      {/* Generate PO Modal Form */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Official Purchase Order"
        description="Select an awarded supplier quotation to issue a binding legal purchase contract"
        maxWidth="lg"
      >
        <form onSubmit={handleGeneratePOSubmit} className="space-y-4 text-xs">
          <div>
            <Select
              label="Awarded Supplier Quotation"
              required
              value={selectedQuoteId}
              onChange={(e) => {
                const qId = e.target.value;
                setSelectedQuoteId(qId);
                const q = quotations.find((quo) => quo.id === qId);
                if (q) setPaymentTerms(q.paymentTerms);
              }}
              options={
                selectedQuotations.length > 0
                  ? selectedQuotations.map((q) => ({
                      value: q.id,
                      label: `${q.quotationNumber} — ${q.vendorName} (${formatINR(q.totalAmount)}) for ${q.rfqNumber}`,
                    }))
                  : [{ value: '', label: 'No SELECTED quotations available. Award an RFQ first.' }]
              }
            />
          </div>

          <div>
            <Input
              label="Delivery Destination Address"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Agreed Payment Terms"
              required
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Shipping / Receiving Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              disabled={!selectedQuoteId}
              leftIcon={<FileCheck2 className="w-4 h-4" />}
            >
              Generate PO (PO-2026-...)
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
