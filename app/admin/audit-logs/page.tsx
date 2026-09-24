'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { AuditLogView } from '../../../components/AuditLogView';

export default function AdminAuditLogsPage() {
  return (
    <AppShell
      title="Compliance & Audit Logs"
      subtitle="Complete chronological audit trail of all procurement lifecycle events and security actions"
    >
      <AuditLogView />
    </AppShell>
  );
}
