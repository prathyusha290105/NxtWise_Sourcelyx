import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { Quotation } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import {
  col,
  getById,
  listAll,
  setById,
  withId,
} from '../lib/firestore/helpers';

export const quotationService = {
  getAll: (): Promise<Quotation[]> =>
    listAll<Quotation>(COLLECTIONS.quotations),

  getById: (id: string): Promise<Quotation | null> =>
    getById<Quotation>(COLLECTIONS.quotations, id),

  getByRfq: async (rfqId: string): Promise<Quotation[]> => {
    const all = await listAll<Quotation>(
      COLLECTIONS.quotations
    );

    return all.filter(
      (quotation) => quotation.rfqId === rfqId
    );
  },

  getByVendor: async (
    vendorId: string
  ): Promise<Quotation[]> => {
    const all = await listAll<Quotation>(
      COLLECTIONS.quotations
    );

    return all.filter(
      (quotation) => quotation.vendorId === vendorId
    );
  },

  upsert: (quotation: Quotation): Promise<void> =>
    setById(
      COLLECTIONS.quotations,
      quotation.id,
      { ...quotation }
    ),

  subscribeAll: (
    onData: (rows: Quotation[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const q = query(
      col(COLLECTIONS.quotations),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(
      q,
      (snap) => {
        onData(
          snap.docs.map((doc) =>
            withId<Quotation>(doc)
          )
        );
      },
      (error) => onError?.(error)
    );
  },
};