import { PurchaseOrder } from '../lib/types';
import { INITIAL_PURCHASE_ORDERS } from '../lib/mock-data/purchaseOrders';

export const purchaseOrderService = {
  getAll: (): PurchaseOrder[] => INITIAL_PURCHASE_ORDERS,
  getById: (id: string): PurchaseOrder | undefined =>
    INITIAL_PURCHASE_ORDERS.find((po) => po.id === id),
  getByVendor: (vendorId: string): PurchaseOrder[] =>
    INITIAL_PURCHASE_ORDERS.filter((po) => po.vendorId === vendorId),
};
