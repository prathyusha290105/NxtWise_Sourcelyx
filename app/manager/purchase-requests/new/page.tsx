'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '../../../../components/AppShell';
import { useApp } from '../../../../lib/context/AppContext';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import { calculateApprovalLevels } from '../../../../lib/approvalRules';
import { formatINR } from '../../../../lib/utils';
import { PurchaseRequestPriority, PurchaseRequestItem } from '../../../../lib/types';
import {
  Plus,
  Trash2,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const { createPurchaseRequest, currentUser, departments } = useApp();

  const [title, setTitle] = useState('High-Performance Developer Monitors & Docks');
  const [description, setDescription] = useState(
    'Procurement of 2x 27-inch 4K USB-C monitors for new senior engineers in the Core Platform team.'
  );
  const [justification, setJustification] = useState(
    'Quarterly hiring onboarding hardware requirements for Q3 engineering sprint.'
  );
  const [departmentId, setDepartmentId] = useState('dept-eng');
  const [priority, setPriority] = useState<PurchaseRequestPriority>('HIGH');
  const [requiredDate, setRequiredDate] = useState('2026-10-15');

  // Pre-configured line items totaling ₹50,000 for seamless 2-tier demo!
  const [items, setItems] = useState<PurchaseRequestItem[]>([
    {
      id: 'it-1',
      item: 'Dell UltraSharp 27" 4K Monitor (U2723QE)',
      description: 'IPS Black panel with integrated USB-C 90W hub',
      quantity: 2,
      unitPrice: 25000,
      total: 50000,
    },
  ]);

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const calculatedApprovalTiers = calculateApprovalLevels(totalAmount);

  const handleAddItem = () => {
    const newItem: PurchaseRequestItem = {
      id: `it-${Date.now()}`,
      item: '',
      description: '',
      quantity: 1,
      unitPrice: 10000,
      total: 10000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof PurchaseRequestItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      current.total = Number(current.quantity) * Number(current.unitPrice);
    }
    updated[index] = current;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some((i) => !i.item.trim())) {
      alert('Please fill in the item name for all line items.');
      return;
    }

    const dept = departments.find((d) => d.id === departmentId);

    createPurchaseRequest({
      title,
      description,
      justification,
      departmentId,
      departmentName: dept?.name || 'Engineering',
      requestedById: currentUser.id,
      requestedByName: currentUser.name,
      priority,
      requiredDate,
      items,
      totalAmount,
    });

    router.push('/manager/purchase-requests');
  };

  return (
    <AppShell
      title="Create Purchase Requisition"
      subtitle="Raise a commercial demand with line-item estimates and automatic authorization tier assignment"
      actions={
        <Link href="/manager/purchase-requests">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Requests
          </Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-indigo-600" />
            1. Requisition Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Requisition Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Developer Laptops & Monitors"
              />
            </div>

            <Select
              label="Requesting Department"
              required
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              options={departments.map((d) => ({
                value: d.id,
                label: `${d.name} (${d.code})`,
              }))}
            />

            <Select
              label="Priority Level"
              required
              value={priority}
              onChange={(e) => setPriority(e.target.value as PurchaseRequestPriority)}
              options={[
                { value: 'LOW', label: 'Low — Standard Planned' },
                { value: 'MEDIUM', label: 'Medium — Normal Operations' },
                { value: 'HIGH', label: 'High — Critical Project Need' },
                { value: 'URGENT', label: 'Urgent — Immediate Blockage' },
              ]}
            />

            <div>
              <Input
                label="Required By Date"
                type="date"
                required
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Scope of Requisition & Technical Specs"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Business Justification & Expected ROI"
                required
                rows={2}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Line Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>2. Line Items ({items.length})</span>
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-4">
                  <Input
                    label={`Item #${idx + 1}`}
                    required
                    placeholder="Item name"
                    value={item.item}
                    onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Description"
                    placeholder="Model / Specs"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    min={1}
                    required
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Unit Price (₹)"
                    type="number"
                    min={0}
                    required
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))
                    }
                  />
                </div>
                <div className="sm:col-span-1 flex items-center justify-center pb-1">
                  <button
                    type="button"
                    disabled={items.length <= 1}
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Automatic Calculation & Approval Tier Preview Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                Total Requisition Amount
              </div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                {formatINR(totalAmount)}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-400 flex items-center sm:justify-end gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Computed Approval Hierarchy:</span>
              </div>
              <div className="text-xs font-bold text-emerald-300 mt-0.5">
                {calculatedApprovalTiers.map((lvl) => `Tier ${lvl.level}: ${lvl.roleName}`).join(' → ')}
              </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/manager/purchase-requests">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="md"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Submit for Approval
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
