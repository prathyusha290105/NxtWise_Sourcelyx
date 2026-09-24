export type Role =
  | 'ADMIN'
  | 'PROCUREMENT'
  | 'PROCUREMENT_MANAGER'
  | 'FINANCE'
  | 'DEPARTMENT_MANAGER'
  | 'VENDOR'
  | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  vendorId?: string;
  avatar?: string;
  title?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
}

export type VendorStatus =
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'REJECTED'
  | 'INACTIVE';

export interface VendorDocument {
  id: string;
  name: string;
  type: 'GST_CERTIFICATE' | 'PAN' | 'BUSINESS_REG' | 'BANK_PROOF' | 'OTHER';
  url: string;
  fileSize: string;
  uploadedAt: string;
  verified: boolean;
}

export interface VendorPerformance {
  deliveryPerformance: number; // 0-100
  qualityRating: number;       // 1-5
  priceCompetitiveness: number; // 1-5
  responseRate: number;        // 0-100
  overallRating: number;       // 1-5
  totalOrdersCompleted: number;
}

export interface Vendor {
  id: string;
  companyName: string;
  businessType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  panNumber: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  status: VendorStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  documents: VendorDocument[];
  performance?: VendorPerformance;
  category?: string;
}

export type PurchaseRequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SENT_BACK'
  | 'RFQ_CREATED'
  | 'PO_GENERATED'
  | 'COMPLETED';

export interface PurchaseRequestItem {
  id: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ApprovalStep {
  level: number;
  role: Role;
  roleName: string;
  assignedToName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SENT_BACK';
  actionDate?: string;
  actionBy?: string;
  comments?: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string; // e.g. PR-2026-001
  title: string;
  description: string;
  justification: string;
  departmentId: string;
  departmentName: string;
  requestedById: string;
  requestedByName: string;
  priority: PurchaseRequestPriority;
  requiredDate: string;
  items: PurchaseRequestItem[];
  totalAmount: number;
  status: PurchaseRequestStatus;
  currentApprovalLevel: number;
  totalApprovalLevels: number;
  approvals: ApprovalStep[];
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  rfqId?: string;
  poId?: string;
}

export type RFQStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';

export interface RFQVendorInvite {
  vendorId: string;
  vendorName: string;
  contactEmail: string;
  invitedAt: string;
  hasQuoted: boolean;
}

export interface RFQ {
  id: string;
  rfqNumber: string; // e.g. RFQ-2026-001
  title: string;
  description: string;
  purchaseRequestId: string;
  purchaseRequestNumber: string;
  deadline: string;
  deliveryRequirements: string;
  paymentTerms: string;
  status: RFQStatus;
  invitedVendors: RFQVendorInvite[];
  quotationCount: number;
  createdAt: string;
  createdBy: string;
}

export type QuotationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'SELECTED' | 'REJECTED';

export interface QuotationItem {
  id: string;
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. QUO-2026-001
  rfqId: string;
  rfqNumber: string;
  vendorId: string;
  vendorName: string;
  items: QuotationItem[];
  unitPrice: number; // base summary
  quantity: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  deliveryDays: number;
  paymentTerms: string;
  validUntil: string;
  notes: string;
  status: QuotationStatus;
  submittedAt: string;
  evaluatedAt?: string;
  selectionNotes?: string;
}

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'GENERATED'
  | 'SENT'
  | 'ACKNOWLEDGED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-2026-0001
  purchaseRequestId: string;
  purchaseRequestNumber: string;
  rfqId: string;
  rfqNumber: string;
  quotationId: string;
  quotationNumber: string;
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  vendorGst: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  paymentTerms: string;
  createdById: string;
  createdByName: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  notes?: string;
}

export interface Budget {
  id: string;
  departmentId: string;
  departmentName: string;
  fiscalYear: string;
  allocatedBudget: number;
  utilizedBudget: number;
  committedSpend: number;
  availableBudget: number;
  utilizationPercentage: number;
}

export interface Notification {
  id: string;
  userId?: string;
  targetRole?: Role;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  action:
    | 'APPROVED_VENDOR'
    | 'REJECTED_VENDOR'
    | 'VERIFIED_VENDOR'
    | 'REGISTERED_VENDOR'
    | 'CREATED_PURCHASE_REQUEST'
    | 'APPROVED_PURCHASE_REQUEST'
    | 'REJECTED_PURCHASE_REQUEST'
    | 'SENT_BACK_PURCHASE_REQUEST'
    | 'CREATED_RFQ'
    | 'SUBMITTED_QUOTATION'
    | 'SELECTED_VENDOR'
    | 'GENERATED_PURCHASE_ORDER'
    | 'SENT_PURCHASE_ORDER'
    | 'SYSTEM_UPDATE';
  entity: 'VENDOR' | 'PURCHASE_REQUEST' | 'RFQ' | 'QUOTATION' | 'PURCHASE_ORDER' | 'BUDGET';
  entityId: string;
  description: string;
  ipAddress?: string;
}
