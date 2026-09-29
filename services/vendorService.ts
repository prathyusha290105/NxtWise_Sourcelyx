import { onSnapshot } from 'firebase/firestore';
import { Vendor } from '../lib/types';
import { COLLECTIONS } from '../lib/firestore/constants';
import { col, getById, setById, withId } from '../lib/firestore/helpers';

export const vendorService = {
  getById: (id: string) => getById<Vendor>(COLLECTIONS.vendors, id),

  upsert: (vendor: Vendor) => setById(COLLECTIONS.vendors, vendor.id, { ...vendor }),

  subscribeAll: (
    onData: (rows: Vendor[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return onSnapshot(
      col(COLLECTIONS.vendors),
      (snap) => onData(snap.docs.map((d) => withId<Vendor>(d))),
      (err) => onError?.(err)
    );
  },
};
