'use client';

import React, { useState } from 'react';
import { Quotation, RFQ } from '../lib/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { formatINR, formatDate } from '../lib/utils';
import { Check, CheckCircle2, Trophy, Clock, CreditCard, Calendar, AlertCircle } from 'lucide-react';

export interface QuotationComparisonProps {
  rfq: RFQ;
  quotations: Quotation[];
  onSelectVendor: (quotationId: string, selectionNotes?: string) => void;
  canSelect?: boolean;
}

export const QuotationComparison: React.FC<QuotationComparisonProps> = ({
  rfq,
  quotations,
  onSelectVendor,
  canSelect = true,
}) => {
  const [selectedQuoIdToConfirm, setSelectedQuoIdToConfirm] = useState<string | null>(null);

  if (quotations.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-sm text-slate-500">No vendor quotations have been submitted yet for this RFQ.</p>
      </Card>
    );
  }

  // Find lowest price and fastest delivery for highlighting
  const lowestPrice = Math.min(...quotations.map((q) => q.totalAmount));
  const fastestDelivery = Math.min(...quotations.map((q) => q.deliveryDays));

  const targetQuo = quotations.find((q) => q.id === selectedQuoIdToConfirm);

  return (
    <div className="space-y-6">
      {/* RFQ Reference Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
            Quotation Comparison Matrix
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            {rfq.rfqNumber}: {rfq.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Linked to PR: {rfq.purchaseRequestNumber} • Deadline: {formatDate(rfq.deadline)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={rfq.status} />
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
            {quotations.length} Bids Evaluated
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-48 font-bold text-slate-600 uppercase text-xs tracking-wider">
                Evaluation Criteria
              </th>
              {quotations.map((quo) => {
                const isWinner = quo.status === 'SELECTED';
                return (
                  <th
                    key={quo.id}
                    className={`p-4 min-w-[240px] text-center border-l border-slate-200 ${
                      isWinner ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {isWinner && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                          <Trophy className="w-3 h-3" />
                          <span>Awarded / Selected</span>
                        </div>
                      )}
                      <div className="font-bold text-slate-900 text-base">{quo.vendorName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {quo.quotationNumber}
                      </div>
                      <div className="mt-2">
                        <StatusBadge status={quo.status} />
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Total Amount Row */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Total Amount (incl. Tax)
              </td>
              {quotations.map((quo) => {
                const isLowest = quo.totalAmount === lowestPrice;
                return (
                  <td key={quo.id} className="p-4 text-center border-l border-slate-200">
                    <div
                      className={`text-lg font-black ${
                        isLowest ? 'text-emerald-700 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {formatINR(quo.totalAmount)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Subtotal: {formatINR(quo.subtotal)} + Tax: {formatINR(quo.tax)}
                    </div>
                    {isLowest && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Lowest Price
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Delivery Days Row */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Delivery Lead Time</span>
                </div>
              </td>
              {quotations.map((quo) => {
                const isFastest = quo.deliveryDays === fastestDelivery;
                return (
                  <td key={quo.id} className="p-4 text-center border-l border-slate-200">
                    <div className="font-bold text-slate-800 text-sm">{quo.deliveryDays} Days</div>
                    {isFastest && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        Fastest Turnaround
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Payment Terms Row */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Payment Terms</span>
                </div>
              </td>
              {quotations.map((quo) => (
                <td key={quo.id} className="p-4 text-center border-l border-slate-200">
                  <span className="font-semibold text-slate-800">{quo.paymentTerms}</span>
                </td>
              ))}
            </tr>

            {/* Validity Row */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Quotation Validity</span>
                </div>
              </td>
              {quotations.map((quo) => (
                <td key={quo.id} className="p-4 text-center border-l border-slate-200 text-xs text-slate-600">
                  Valid until {formatDate(quo.validUntil)}
                </td>
              ))}
            </tr>

            {/* Commercial Notes Row */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-slate-700">Vendor Notes</td>
              {quotations.map((quo) => (
                <td key={quo.id} className="p-4 text-center border-l border-slate-200 text-xs text-slate-500 italic max-w-xs">
                  &ldquo;{quo.notes || 'None provided'}&rdquo;
                </td>
              ))}
            </tr>

            {/* Selection Action Button Row */}
            {canSelect && (
              <tr className="bg-slate-50">
                <td className="p-4 font-bold text-slate-800">Procurement Action</td>
                {quotations.map((quo) => {
                  const isSelected = quo.status === 'SELECTED';
                  const isAnySelected = quotations.some((q) => q.status === 'SELECTED');

                  return (
                    <td key={quo.id} className="p-4 text-center border-l border-slate-200">
                      {isSelected ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Vendor Selected</span>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isAnySelected}
                          leftIcon={<Check className="w-4 h-4" />}
                          onClick={() => setSelectedQuoIdToConfirm(quo.id)}
                        >
                          Select Vendor
                        </Button>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog for Vendor Selection */}
      <ConfirmDialog
        isOpen={!!selectedQuoIdToConfirm}
        onClose={() => setSelectedQuoIdToConfirm(null)}
        title="Select & Award Quotation"
        message={`Are you sure you want to select ${targetQuo?.vendorName} (Quotation: ${targetQuo?.quotationNumber}) for ${formatINR(
          targetQuo?.totalAmount || 0
        )}? This will mark this quotation as SELECTED and reject competing bids.`}
        confirmText="Confirm Selection"
        variant="primary"
        requireReason
        reasonLabel="Justification for Selection"
        reasonPlaceholder="e.g. Best overall value proposition with compliant delivery terms."
        onConfirm={(notes) => {
          if (selectedQuoIdToConfirm) {
            onSelectVendor(selectedQuoIdToConfirm, notes);
            setSelectedQuoIdToConfirm(null);
          }
        }}
      />
    </div>
  );
};
