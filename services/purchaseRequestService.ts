import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { PurchaseRequest } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

export const purchaseRequestService = {
  getAll: (): Promise<PurchaseRequest[]> =>
    listAll<PurchaseRequest>(
      COLLECTIONS.purchaseRequests
    ),

  getById: (
    id: string
  ): Promise<PurchaseRequest | null> =>
    getById<PurchaseRequest>(
      COLLECTIONS.purchaseRequests,
      id
    ),

  upsert: (
    pr: PurchaseRequest
  ): Promise<void> =>
    setById(
      COLLECTIONS.purchaseRequests,
      pr.id,
      { ...pr }
    ),

  subscribeAll: (
    onData: (rows: PurchaseRequest[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.purchaseRequests),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<PurchaseRequest>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};