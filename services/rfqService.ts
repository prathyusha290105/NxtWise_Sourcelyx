import { RFQ } from '../lib/types';
import { INITIAL_RFQS } from '../lib/mock-data/rfqs';

export const rfqService = {
  getAll: (): RFQ[] => INITIAL_RFQS,
  getById: (id: string): RFQ | undefined => INITIAL_RFQS.find((r) => r.id === id),
  getByVendor: (vendorId: string): RFQ[] =>
    INITIAL_RFQS.filter((r) => r.invitedVendors.some((iv) => iv.vendorId === vendorId)),
};
