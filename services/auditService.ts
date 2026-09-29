import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { AuditLog } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

function createAuditId(): string {
  return `aud-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export const auditService = {
  getAll: (): Promise<AuditLog[]> =>
    listAll<AuditLog>(
      COLLECTIONS.auditLogs
    ),

  getById: (
    id: string
  ): Promise<AuditLog | null> =>
    getById<AuditLog>(
      COLLECTIONS.auditLogs,
      id
    ),

  getByEntity: async (
    entity: AuditLog['entity'],
    entityId: string
  ): Promise<AuditLog[]> => {
    const all = await listAll<AuditLog>(
      COLLECTIONS.auditLogs
    );

    return all.filter(
      (log) =>
        log.entity === entity &&
        log.entityId === entityId
    );
  },

  create: async (
    auditLog: Omit<AuditLog, 'id'>
  ): Promise<AuditLog> => {
    const newLog: AuditLog = {
      ...auditLog,
      id: createAuditId(),
    };

    await setById(
      COLLECTIONS.auditLogs,
      newLog.id,
      { ...newLog }
    );

    return newLog;
  },

  upsert: (
    auditLog: AuditLog
  ): Promise<void> =>
    setById(
      COLLECTIONS.auditLogs,
      auditLog.id,
      { ...auditLog }
    ),

  subscribeAll: (
    onData: (rows: AuditLog[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.auditLogs),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<AuditLog>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};