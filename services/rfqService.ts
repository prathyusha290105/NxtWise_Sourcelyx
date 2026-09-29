import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { RFQ } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

export const rfqService = {
  getAll: (): Promise<RFQ[]> =>
    listAll<RFQ>(COLLECTIONS.rfqs),

  getById: (id: string): Promise<RFQ | null> =>
    getById<RFQ>(COLLECTIONS.rfqs, id),

  getByVendor: async (vendorId: string): Promise<RFQ[]> => {
    const all = await listAll<RFQ>(COLLECTIONS.rfqs);

    return all.filter((rfq) =>
      rfq.invitedVendors.some(
        (vendor) => vendor.vendorId === vendorId
      )
    );
  },

  upsert: (rfq: RFQ): Promise<void> =>
    setById(COLLECTIONS.rfqs, rfq.id, { ...rfq }),

  subscribeAll: (
    onData: (rows: RFQ[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.rfqs),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) => withId<RFQ>(doc))
        );
      },
      (error) => onError?.(error)
    );
  },
};