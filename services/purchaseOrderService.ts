import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { PurchaseOrder } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

export const purchaseOrderService = {
  getAll: (): Promise<PurchaseOrder[]> =>
    listAll<PurchaseOrder>(
      COLLECTIONS.purchaseOrders
    ),

  getById: (
    id: string
  ): Promise<PurchaseOrder | null> =>
    getById<PurchaseOrder>(
      COLLECTIONS.purchaseOrders,
      id
    ),

  getByVendor: async (
    vendorId: string
  ): Promise<PurchaseOrder[]> => {
    const all = await listAll<PurchaseOrder>(
      COLLECTIONS.purchaseOrders
    );

    return all.filter(
      (po) => po.vendorId === vendorId
    );
  },

  upsert: (
    purchaseOrder: PurchaseOrder
  ): Promise<void> =>
    setById(
      COLLECTIONS.purchaseOrders,
      purchaseOrder.id,
      { ...purchaseOrder }
    ),

  subscribeAll: (
    onData: (rows: PurchaseOrder[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.purchaseOrders),
      orderBy('orderDate', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<PurchaseOrder>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};