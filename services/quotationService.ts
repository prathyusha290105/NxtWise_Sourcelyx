import { Quotation } from '../lib/types';
import { INITIAL_QUOTATIONS } from '../lib/mock-data/quotations';

export const quotationService = {
  getAll: (): Quotation[] => INITIAL_QUOTATIONS,
  getByRfq: (rfqId: string): Quotation[] =>
    INITIAL_QUOTATIONS.filter((q) => q.rfqId === rfqId),
  getByVendor: (vendorId: string): Quotation[] =>
    INITIAL_QUOTATIONS.filter((q) => q.vendorId === vendorId),
};
