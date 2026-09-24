import { PurchaseRequest, PurchaseRequestStatus } from '../lib/types';
import { INITIAL_PURCHASE_REQUESTS } from '../lib/mock-data/purchaseRequests';

export const purchaseRequestService = {
  getAll: (statusFilter?: PurchaseRequestStatus | 'ALL'): PurchaseRequest[] => {
    if (!statusFilter || statusFilter === 'ALL') {
      return INITIAL_PURCHASE_REQUESTS;
    }
    return INITIAL_PURCHASE_REQUESTS.filter((pr) => pr.status === statusFilter);
  },

  getById: (id: string): PurchaseRequest | undefined => {
    return INITIAL_PURCHASE_REQUESTS.find((pr) => pr.id === id);
  },

  getByDepartment: (departmentId: string): PurchaseRequest[] => {
    return INITIAL_PURCHASE_REQUESTS.filter((pr) => pr.departmentId === departmentId);
  },
};
