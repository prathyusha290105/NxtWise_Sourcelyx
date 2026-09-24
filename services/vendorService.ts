import { Vendor, VendorStatus } from '../lib/types';
import { INITIAL_VENDORS } from '../lib/mock-data/vendors';

export const vendorService = {
  getVendors: (statusFilter?: VendorStatus | 'ALL'): Vendor[] => {
    if (!statusFilter || statusFilter === 'ALL') {
      return INITIAL_VENDORS;
    }
    return INITIAL_VENDORS.filter((v) => v.status === statusFilter);
  },

  getVendorById: (id: string): Vendor | undefined => {
    return INITIAL_VENDORS.find((v) => v.id === id);
  },

  getActiveVendors: (): Vendor[] => {
    return INITIAL_VENDORS.filter((v) => v.status === 'ACTIVE');
  },
};
