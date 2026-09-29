import {
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestore/constants';
import { col, docRef, getById, setById, stripUndefined, withId } from '../lib/firestore/helpers';
import {
  AuditLog,
  Budget,
  Department,
  Notification,
  PurchaseOrder,
  PurchaseRequest,
  Quotation,
  RFQ,
  Vendor,
} from '../lib/types';

function subscribeCollection<T>(
  name: string,
  onData: (rows: T[]) => void,
  onError?: (e: Error) => void,
  orderField?: string
): () => void {
  const q = orderField ? query(col(name), orderBy(orderField, 'desc')) : col(name);
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => withId<T>(d))),
    (err) => onError?.(err)
  );
}

export const departmentService = {
  subscribeAll: (onData: (rows: Department[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<Department>(COLLECTIONS.departments, onData, onError),
  upsert: (dept: Department) => setById(COLLECTIONS.departments, dept.id, { ...dept }),
};

export const vendorService = {
  subscribeAll: (onData: (rows: Vendor[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<Vendor>(COLLECTIONS.vendors, onData, onError),
  getById: (id: string) => getById<Vendor>(COLLECTIONS.vendors, id),
  upsert: (vendor: Vendor) => setById(COLLECTIONS.vendors, vendor.id, { ...vendor }),
  updateVendor: async (id: string, patch: Partial<Vendor>): Promise<void> => {
  const existing = await getById<Vendor>(COLLECTIONS.vendors, id);

  if (!existing) {
    throw new Error(`Vendor ${id} not found`);
  }

  await setById(
    COLLECTIONS.vendors,
    id,
    {
      ...existing,
      ...patch,
    } as Record<string, unknown>
  );
},
};

export const purchaseRequestService = {
  subscribeAll: (onData: (rows: PurchaseRequest[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<PurchaseRequest>(COLLECTIONS.purchaseRequests, onData, onError, 'createdAt'),
  getById: (id: string) => getById<PurchaseRequest>(COLLECTIONS.purchaseRequests, id),
  upsert: (pr: PurchaseRequest) => setById(COLLECTIONS.purchaseRequests, pr.id, { ...pr }),
};

export const rfqService = {
  subscribeAll: (onData: (rows: RFQ[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<RFQ>(COLLECTIONS.rfqs, onData, onError, 'createdAt'),
  getById: (id: string) => getById<RFQ>(COLLECTIONS.rfqs, id),
  upsert: (rfq: RFQ) => setById(COLLECTIONS.rfqs, rfq.id, { ...rfq }),
};

export const quotationService = {
  subscribeAll: (onData: (rows: Quotation[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<Quotation>(COLLECTIONS.quotations, onData, onError, 'submittedAt'),
  getById: (id: string) => getById<Quotation>(COLLECTIONS.quotations, id),
  upsert: (q: Quotation) => setById(COLLECTIONS.quotations, q.id, { ...q }),
};

export const purchaseOrderService = {
  subscribeAll: (onData: (rows: PurchaseOrder[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<PurchaseOrder>(COLLECTIONS.purchaseOrders, onData, onError, 'orderDate'),
  getById: (id: string) => getById<PurchaseOrder>(COLLECTIONS.purchaseOrders, id),
  upsert: (po: PurchaseOrder) => setById(COLLECTIONS.purchaseOrders, po.id, { ...po }),
};

export const budgetService = {
  subscribeAll: (onData: (rows: Budget[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<Budget>(COLLECTIONS.budgets, onData, onError),
  getById: (id: string) => getById<Budget>(COLLECTIONS.budgets, id),
  upsert: (b: Budget) => setById(COLLECTIONS.budgets, b.id, { ...b }),
};

export const notificationService = {
  subscribeAll: (onData: (rows: Notification[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<Notification>(COLLECTIONS.notifications, onData, onError, 'createdAt'),
  upsert: (n: Notification) => setById(COLLECTIONS.notifications, n.id, { ...n }),
};

export const auditService = {
  subscribeAll: (onData: (rows: AuditLog[]) => void, onError?: (e: Error) => void) =>
    subscribeCollection<AuditLog>(COLLECTIONS.auditLogs, onData, onError, 'timestamp'),
  upsert: (log: AuditLog) => setById(COLLECTIONS.auditLogs, log.id, { ...log }),
};

export const approvalService = {
  // Filtering stays in the UI via canUserApproveAtStep; this helper is for callers that pass live data.
  getPendingForRole: purchaseRequestService.subscribeAll,
};

export async function nextSerial(counterId: string): Promise<number> {
  const ref = docRef(COLLECTIONS.counters, counterId);
  const db = getFirebaseDb();
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? Number(snap.data()?.seq || 0) : 0;
    const seq = current + 1;
    tx.set(ref, { seq, updatedAt: serverTimestamp() }, { merge: true });
    return seq;
  });
}

export async function setCounter(counterId: string, seq: number): Promise<void> {
  await setById(COLLECTIONS.counters, counterId, { seq });
}

export async function commitBatch(
  writes: Array<{ collection: string; id: string; data: Record<string, unknown> }>
): Promise<void> {
  const db = getFirebaseDb();
  const CHUNK = 400;
  for (let i = 0; i < writes.length; i += CHUNK) {
    const batch = writeBatch(db);
    const slice = writes.slice(i, i + CHUNK);
    for (const w of slice) {
      const { id: _id, ...rest } = w.data;
      batch.set(docRef(w.collection, w.id), stripUndefined(rest));
    }
    await batch.commit();
  }
}

export function subscribeNotificationsForUser(
  uid: string,
  role: string,
  onData: (rows: Notification[]) => void,
  onError?: (e: Error) => void
): () => void {
  // Full collection is used so role-wide + user-specific rows stay in one listener.
  // Client still filters; rules restrict which documents are readable.
  void uid;
  void role;
  void where;
  return notificationService.subscribeAll(onData, onError);
}
