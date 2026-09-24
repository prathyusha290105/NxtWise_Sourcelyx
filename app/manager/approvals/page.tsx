'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { ApprovalListView } from '../../../components/ApprovalListView';

export default function ManagerApprovalsPage() {
  return (
    <AppShell
      title="Departmental Purchase Approvals"
      subtitle="Review and authorize purchase requisitions originating from your business unit (Tier 1 signoff)"
    >
      <ApprovalListView roleContext="DEPARTMENT_MANAGER" />
    </AppShell>
  );
}
