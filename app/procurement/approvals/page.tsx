'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { ApprovalListView } from '../../../components/ApprovalListView';

export default function ProcurementApprovalsPage() {
  return (
    <AppShell
      title="Procurement Level Purchase Approvals"
      subtitle="Authorized signoffs for high-value purchase requisitions (Tier 2 procurement compliance checks)"
    >
      <ApprovalListView roleContext="PROCUREMENT_MANAGER" />
    </AppShell>
  );
}
