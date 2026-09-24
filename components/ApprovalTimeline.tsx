'use client';

import React from 'react';
import { ApprovalStep, PurchaseRequestStatus } from '../lib/types';
import { CheckCircle2, Clock, XCircle, ArrowRightCircle } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export interface ApprovalTimelineProps {
  approvals: ApprovalStep[];
  currentLevel: number;
  totalLevels: number;
  status: PurchaseRequestStatus;
  createdAt: string;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  approvals,
  currentLevel,
  totalLevels,
  status,
  createdAt,
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Step 0: Created */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs ring-4 ring-emerald-50">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Request Created</div>
            <div className="text-[10px] text-slate-400">{formatDateTime(createdAt)}</div>
          </div>
        </div>

        {/* Separator line */}
        <div className="hidden sm:block flex-1 h-0.5 bg-slate-200 mx-2" />

        {/* Steps 1 to N */}
        {approvals.map((step, idx) => {
          const isDone = step.status === 'APPROVED';
          const isRejected = step.status === 'REJECTED';
          const isSentBack = step.status === 'SENT_BACK';
          const isCurrent = step.level === currentLevel && status === 'PENDING_APPROVAL';

          let icon = <Clock className="w-4 h-4" />;
          let circleBg = 'bg-slate-100 text-slate-400 ring-slate-50';

          if (isDone) {
            icon = <CheckCircle2 className="w-4 h-4" />;
            circleBg = 'bg-emerald-100 text-emerald-600 ring-emerald-50';
          } else if (isRejected) {
            icon = <XCircle className="w-4 h-4" />;
            circleBg = 'bg-rose-100 text-rose-600 ring-rose-50';
          } else if (isSentBack) {
            icon = <ArrowRightCircle className="w-4 h-4" />;
            circleBg = 'bg-amber-100 text-amber-600 ring-amber-50';
          } else if (isCurrent) {
            icon = <Clock className="w-4 h-4 animate-spin" />;
            circleBg = 'bg-indigo-100 text-indigo-600 ring-indigo-50 font-bold';
          }

          return (
            <React.Fragment key={step.level}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ${circleBg}`}
                >
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Tier {step.level}: {step.roleName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {step.status === 'APPROVED' && step.actionBy ? (
                      <span className="text-emerald-700">Approved by {step.actionBy}</span>
                    ) : step.status === 'REJECTED' ? (
                      <span className="text-rose-600">Rejected ({step.comments || 'No comment'})</span>
                    ) : isCurrent ? (
                      <span className="text-indigo-600 font-semibold">Under Review</span>
                    ) : (
                      'Pending'
                    )}
                  </div>
                </div>
              </div>
              {idx < approvals.length - 1 && (
                <div className="hidden sm:block flex-1 h-0.5 bg-slate-200 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
