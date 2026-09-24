import { AuditLog } from '../lib/types';
import { INITIAL_AUDIT_LOGS } from '../lib/mock-data/auditLogs';

export const auditService = {
  getAll: (): AuditLog[] => INITIAL_AUDIT_LOGS,
  getByEntity: (entity: AuditLog['entity'], entityId: string): AuditLog[] =>
    INITIAL_AUDIT_LOGS.filter((l) => l.entity === entity && l.entityId === entityId),
};
