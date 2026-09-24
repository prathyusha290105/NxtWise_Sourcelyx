'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Vendor,
  PurchaseRequest,
  RFQ,
  Quotation,
  PurchaseOrder,
  Budget,
  Notification,
  AuditLog,
  Department,
  Role,
} from '../types';
import { INITIAL_USERS } from '../mock-data/users';
import { INITIAL_VENDORS } from '../mock-data/vendors';
import { INITIAL_DEPARTMENTS } from '../mock-data/departments';
import { INITIAL_PURCHASE_REQUESTS } from '../mock-data/purchaseRequests';
import { INITIAL_RFQS } from '../mock-data/rfqs';
import { INITIAL_QUOTATIONS } from '../mock-data/quotations';
import { INITIAL_PURCHASE_ORDERS } from '../mock-data/purchaseOrders';
import { INITIAL_BUDGETS } from '../mock-data/budgets';
import { INITIAL_NOTIFICATIONS } from '../mock-data/notifications';
import { INITIAL_AUDIT_LOGS } from '../mock-data/auditLogs';
import { calculateApprovalLevels } from '../approvalRules';

interface AppContextType {
  currentUser: User;
  users: User[];
  departments: Department[];
  vendors: Vendor[];
  purchaseRequests: PurchaseRequest[];
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  budgets: Budget[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: Role) => void;
  registerVendor: (vendor: Omit<Vendor, 'id' | 'status' | 'createdAt'>) => Vendor;
  verifyVendor: (vendorId: string, officerName: string) => void;
  approveVendor: (vendorId: string, adminName: string) => void;
  rejectVendor: (vendorId: string, reason: string, officerName: string) => void;
  createPurchaseRequest: (
    req: Omit<
      PurchaseRequest,
      | 'id'
      | 'requestNumber'
      | 'status'
      | 'currentApprovalLevel'
      | 'totalApprovalLevels'
      | 'approvals'
      | 'createdAt'
      | 'updatedAt'
    >
  ) => PurchaseRequest;
  approvePurchaseRequest: (requestId: string, comments?: string) => void;
  rejectPurchaseRequest: (requestId: string, reason: string) => void;
  sendBackPurchaseRequest: (requestId: string, comments: string) => void;
  createRFQ: (
    data: Omit<RFQ, 'id' | 'rfqNumber' | 'status' | 'quotationCount' | 'createdAt'>
  ) => RFQ;
  submitQuotation: (
    data: Omit<Quotation, 'id' | 'quotationNumber' | 'status' | 'submittedAt'>
  ) => Quotation;
  selectQuotation: (quotationId: string, selectionNotes?: string) => void;
  generatePurchaseOrder: (
    quotationId: string,
    options?: { deliveryAddress?: string; paymentTerms?: string; notes?: string }
  ) => PurchaseOrder;
  sendPurchaseOrder: (poId: string) => void;
  acknowledgePurchaseOrder: (poId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_PREFIX = 'sourcelyx_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default admin
  const [users] = useState<User[]>(INITIAL_USERS);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(INITIAL_PURCHASE_REQUESTS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedVendors = localStorage.getItem(`${STORAGE_KEY_PREFIX}vendors`);
      if (savedVendors) setVendors(JSON.parse(savedVendors));

      const savedPRs = localStorage.getItem(`${STORAGE_KEY_PREFIX}prs`);
      if (savedPRs) setPurchaseRequests(JSON.parse(savedPRs));

      const savedRFQs = localStorage.getItem(`${STORAGE_KEY_PREFIX}rfqs`);
      if (savedRFQs) setRfqs(JSON.parse(savedRFQs));

      const savedQuos = localStorage.getItem(`${STORAGE_KEY_PREFIX}quos`);
      if (savedQuos) setQuotations(JSON.parse(savedQuos));

      const savedPOs = localStorage.getItem(`${STORAGE_KEY_PREFIX}pos`);
      if (savedPOs) setPurchaseOrders(JSON.parse(savedPOs));

      const savedBudgets = localStorage.getItem(`${STORAGE_KEY_PREFIX}budgets`);
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));

      const savedNotifs = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifs`);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedAudit = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));
    } catch (e) {
      console.error('Error hydrating state from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}vendors`, JSON.stringify(vendors));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}prs`, JSON.stringify(purchaseRequests));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}rfqs`, JSON.stringify(rfqs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}quos`, JSON.stringify(quotations));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}pos`, JSON.stringify(purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}budgets`, JSON.stringify(budgets));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifs`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }, [
    isHydrated,
    currentUser,
    vendors,
    purchaseRequests,
    rfqs,
    quotations,
    purchaseOrders,
    budgets,
    notifications,
    auditLogs,
  ]);

  const addAuditLog = (
    action: AuditLog['action'],
    entity: AuditLog['entity'],
    entityId: string,
    description: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      entityId,
      description,
      ipAddress: '127.0.0.1 (Local Session)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (
    targetRole: Role | undefined,
    title: string,
    message: string,
    type: Notification['type'],
    link?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      targetRole,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const switchUserRole = (role: Role) => {
    const match = users.find((u) => u.role === role);
    if (match) {
      setCurrentUser(match);
    }
  };

  // Vendor actions
  const registerVendor = (data: Omit<Vendor, 'id' | 'status' | 'createdAt'>): Vendor => {
    const newVendorId = `ven-${Date.now()}`;
    const newVendor: Vendor = {
      ...data,
      id: newVendorId,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
      performance: {
        deliveryPerformance: 90,
        qualityRating: 4.5,
        priceCompetitiveness: 4.5,
        responseRate: 95,
        overallRating: 4.5,
        totalOrdersCompleted: 0,
      },
    };
    setVendors((prev) => [newVendor, ...prev]);

    addAuditLog(
      'REGISTERED_VENDOR',
      'VENDOR',
      newVendorId,
      `Vendor registration submitted for ${newVendor.companyName}.`
    );

    addNotification(
      'PROCUREMENT',
      'New Vendor Onboarding',
      `${newVendor.companyName} submitted registration documents for procurement verification.`,
      'ACTION_REQUIRED',
      '/procurement/vendors'
    );

    return newVendor;
  };

  const verifyVendor = (vendorId: string, officerName: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'VERIFIED',
              verifiedAt: new Date().toISOString(),
              verifiedBy: officerName,
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    const vendorName = vendor ? vendor.companyName : vendorId;

    addAuditLog(
      'VERIFIED_VENDOR',
      'VENDOR',
      vendorId,
      `Procurement verification completed for ${vendorName} by ${officerName}.`
    );

    addNotification(
      'ADMIN',
      'Vendor Ready for Final Approval',
      `${vendorName} was verified by Procurement and is pending final Admin approval.`,
      'ACTION_REQUIRED',
      '/admin/vendors'
    );
  };

  const approveVendor = (vendorId: string, adminName: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'ACTIVE',
              approvedAt: new Date().toISOString(),
              approvedBy: adminName,
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    const vendorName = vendor ? vendor.companyName : vendorId;

    addAuditLog(
      'APPROVED_VENDOR',
      'VENDOR',
      vendorId,
      `Final approval granted to ${vendorName} by ${adminName}. Status set to ACTIVE.`
    );

    addNotification(
      'VENDOR',
      'Onboarding Approved!',
      `Congratulations! Your vendor profile ${vendorName} has been officially approved. You can now participate in RFQs.`,
      'SUCCESS',
      '/vendor/dashboard'
    );
  };

  const rejectVendor = (vendorId: string, reason: string, officerName: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'REJECTED',
              rejectionReason: reason,
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    const vendorName = vendor ? vendor.companyName : vendorId;

    addAuditLog(
      'REJECTED_VENDOR',
      'VENDOR',
      vendorId,
      `Vendor ${vendorName} was rejected by ${officerName}. Reason: ${reason}`
    );

    addNotification(
      'VENDOR',
      'Registration Status Update',
      `Your vendor application for ${vendorName} could not be approved: ${reason}`,
      'WARNING',
      '/vendor/dashboard'
    );
  };

  // Purchase Request actions
  const createPurchaseRequest = (
    req: Omit<
      PurchaseRequest,
      | 'id'
      | 'requestNumber'
      | 'status'
      | 'currentApprovalLevel'
      | 'totalApprovalLevels'
      | 'approvals'
      | 'createdAt'
      | 'updatedAt'
    >
  ): PurchaseRequest => {
    const count = purchaseRequests.length + 1;
    const reqNumber = `PR-2026-${String(count).padStart(3, '0')}`;
    const approvalSteps = calculateApprovalLevels(req.totalAmount);

    const newPR: PurchaseRequest = {
      ...req,
      id: `pr-${Date.now()}`,
      requestNumber: reqNumber,
      status: 'PENDING_APPROVAL',
      currentApprovalLevel: 1,
      totalApprovalLevels: approvalSteps.length,
      approvals: approvalSteps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPurchaseRequests((prev) => [newPR, ...prev]);

    addAuditLog(
      'CREATED_PURCHASE_REQUEST',
      'PURCHASE_REQUEST',
      newPR.id,
      `Created ${newPR.requestNumber} (${newPR.title}) for ₹${newPR.totalAmount.toLocaleString('en-IN')}. Requires ${approvalSteps.length} approval tier(s).`
    );

    // Notify Department Manager
    addNotification(
      'DEPARTMENT_MANAGER',
      'Purchase Request Pending Approval',
      `${newPR.requestNumber} for ${newPR.title} requires Level 1 Department signoff.`,
      'ACTION_REQUIRED',
      '/manager/approvals'
    );

    return newPR;
  };

  const approvePurchaseRequest = (requestId: string, comments?: string) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== requestId) return pr;

        const currentLvl = pr.currentApprovalLevel;
        const updatedApprovals = pr.approvals.map((step) => {
          if (step.level === currentLvl) {
            return {
              ...step,
              status: 'APPROVED' as const,
              actionDate: new Date().toISOString(),
              actionBy: currentUser.name,
              comments: comments || 'Approved',
            };
          }
          return step;
        });

        const isFinalApproval = currentLvl >= pr.totalApprovalLevels;
        const nextLevel = isFinalApproval ? currentLvl : currentLvl + 1;
        const nextStatus = isFinalApproval ? ('APPROVED' as const) : ('PENDING_APPROVAL' as const);

        return {
          ...pr,
          status: nextStatus,
          currentApprovalLevel: nextLevel,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pr = purchaseRequests.find((p) => p.id === requestId);
    if (!pr) return;

    const currentLvl = pr.currentApprovalLevel;
    const isFinalApproval = currentLvl >= pr.totalApprovalLevels;

    addAuditLog(
      'APPROVED_PURCHASE_REQUEST',
      'PURCHASE_REQUEST',
      pr.id,
      `Approval Level ${currentLvl} signoff by ${currentUser.name} (${currentUser.role}) for ${pr.requestNumber}. ${isFinalApproval ? 'All approval tiers completed.' : 'Advanced to next approval level.'}`
    );

    if (isFinalApproval) {
      addNotification(
        'PROCUREMENT',
        'Purchase Request Fully Approved',
        `${pr.requestNumber} (${pr.title}) is now fully approved and ready for RFQ creation.`,
        'SUCCESS',
        '/procurement/purchase-requests'
      );
    } else {
      // Next level notification (e.g. Procurement Manager)
      addNotification(
        'PROCUREMENT_MANAGER',
        'Level 2 PR Approval Required',
        `${pr.requestNumber} (${pr.title}) was approved at Level 1 and now requires Procurement Manager signoff.`,
        'ACTION_REQUIRED',
        '/procurement/approvals'
      );
    }
  };

  const rejectPurchaseRequest = (requestId: string, reason: string) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== requestId) return pr;

        const currentLvl = pr.currentApprovalLevel;
        const updatedApprovals = pr.approvals.map((step) => {
          if (step.level === currentLvl) {
            return {
              ...step,
              status: 'REJECTED' as const,
              actionDate: new Date().toISOString(),
              actionBy: currentUser.name,
              comments: reason,
            };
          }
          return step;
        });

        return {
          ...pr,
          status: 'REJECTED',
          rejectionReason: reason,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pr = purchaseRequests.find((p) => p.id === requestId);
    if (!pr) return;

    addAuditLog(
      'REJECTED_PURCHASE_REQUEST',
      'PURCHASE_REQUEST',
      pr.id,
      `Rejected ${pr.requestNumber} at Level ${pr.currentApprovalLevel} by ${currentUser.name}. Reason: ${reason}`
    );

    addNotification(
      'DEPARTMENT_MANAGER',
      'Purchase Request Rejected',
      `${pr.requestNumber} was rejected by ${currentUser.name}: ${reason}`,
      'WARNING',
      '/manager/purchase-requests'
    );
  };

  const sendBackPurchaseRequest = (requestId: string, comments: string) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== requestId) return pr;

        const currentLvl = pr.currentApprovalLevel;
        const updatedApprovals = pr.approvals.map((step) => {
          if (step.level === currentLvl) {
            return {
              ...step,
              status: 'SENT_BACK' as const,
              actionDate: new Date().toISOString(),
              actionBy: currentUser.name,
              comments,
            };
          }
          return step;
        });

        return {
          ...pr,
          status: 'SENT_BACK',
          rejectionReason: comments,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const pr = purchaseRequests.find((p) => p.id === requestId);
    if (!pr) return;

    addAuditLog(
      'SENT_BACK_PURCHASE_REQUEST',
      'PURCHASE_REQUEST',
      pr.id,
      `Sent back ${pr.requestNumber} for revision by ${currentUser.name}: ${comments}`
    );

    addNotification(
      'DEPARTMENT_MANAGER',
      'Purchase Request Sent Back',
      `${pr.requestNumber} was sent back for clarification/revision: ${comments}`,
      'ACTION_REQUIRED',
      '/manager/purchase-requests'
    );
  };

  // RFQ actions
  const createRFQ = (
    data: Omit<RFQ, 'id' | 'rfqNumber' | 'status' | 'quotationCount' | 'createdAt'>
  ): RFQ => {
    const count = rfqs.length + 1;
    const rfqNumber = `RFQ-2026-${String(count).padStart(3, '0')}`;
    const newId = `rfq-${Date.now()}`;

    const newRFQ: RFQ = {
      ...data,
      id: newId,
      rfqNumber,
      status: 'OPEN',
      quotationCount: 0,
      createdAt: new Date().toISOString(),
    };

    setRfqs((prev) => [newRFQ, ...prev]);

    // Update PR status to RFQ_CREATED
    setPurchaseRequests((prev) =>
      prev.map((pr) =>
        pr.id === data.purchaseRequestId
          ? {
              ...pr,
              status: 'RFQ_CREATED',
              rfqId: newId,
              updatedAt: new Date().toISOString(),
            }
          : pr
      )
    );

    addAuditLog(
      'CREATED_RFQ',
      'RFQ',
      newId,
      `Created ${newRFQ.rfqNumber} for ${newRFQ.title} with ${newRFQ.invitedVendors.length} invited vendor(s).`
    );

    // Notify invited vendors
    data.invitedVendors.forEach((v) => {
      addNotification(
        'VENDOR',
        'New RFQ Bid Invitation',
        `You have been invited to submit a quotation for ${newRFQ.rfqNumber} (${newRFQ.title}). Deadline: ${newRFQ.deadline}.`,
        'INFO',
        '/vendor/rfqs'
      );
    });

    return newRFQ;
  };

  // Quotation actions
  const submitQuotation = (
    data: Omit<Quotation, 'id' | 'quotationNumber' | 'status' | 'submittedAt'>
  ): Quotation => {
    const count = quotations.length + 1;
    const quoNumber = `QUO-2026-${String(count).padStart(3, '0')}`;
    const newQuo: Quotation = {
      ...data,
      id: `quo-${Date.now()}`,
      quotationNumber: quoNumber,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuo, ...prev]);

    // Update RFQ quotation count & mark vendor as hasQuoted
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === data.rfqId
          ? {
              ...r,
              quotationCount: r.quotationCount + 1,
              invitedVendors: r.invitedVendors.map((iv) =>
                iv.vendorId === data.vendorId ? { ...iv, hasQuoted: true } : iv
              ),
            }
          : r
      )
    );

    addAuditLog(
      'SUBMITTED_QUOTATION',
      'QUOTATION',
      newQuo.id,
      `Vendor ${newQuo.vendorName} submitted quotation ${newQuo.quotationNumber} for ₹${newQuo.totalAmount.toLocaleString('en-IN')}.`
    );

    addNotification(
      'PROCUREMENT',
      'Quotation Received',
      `New quotation ${newQuo.quotationNumber} received from ${newQuo.vendorName} for ${newQuo.rfqNumber}.`,
      'INFO',
      '/procurement/quotations'
    );

    return newQuo;
  };

  const selectQuotation = (quotationId: string, selectionNotes?: string) => {
    const selectedQuo = quotations.find((q) => q.id === quotationId);
    if (!selectedQuo) return;

    // Set selected quotation to SELECTED, others for this RFQ to REJECTED
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.rfqId === selectedQuo.rfqId) {
          if (q.id === quotationId) {
            return {
              ...q,
              status: 'SELECTED',
              evaluatedAt: new Date().toISOString(),
              selectionNotes: selectionNotes || 'Selected by procurement officer.',
            };
          } else {
            return {
              ...q,
              status: 'REJECTED',
              evaluatedAt: new Date().toISOString(),
              selectionNotes: 'Alternative proposal selected.',
            };
          }
        }
        return q;
      })
    );

    // Mark RFQ as AWARDED
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === selectedQuo.rfqId ? { ...r, status: 'AWARDED' } : r
      )
    );

    addAuditLog(
      'SELECTED_VENDOR',
      'QUOTATION',
      selectedQuo.id,
      `Awarded RFQ ${selectedQuo.rfqNumber} to ${selectedQuo.vendorName} via quotation ${selectedQuo.quotationNumber} (₹${selectedQuo.totalAmount.toLocaleString('en-IN')}).`
    );

    addNotification(
      'VENDOR',
      'Quotation Awarded!',
      `Congratulations! Your quotation ${selectedQuo.quotationNumber} for ${selectedQuo.rfqNumber} was selected. Purchase Order generation is in progress.`,
      'SUCCESS',
      '/vendor/quotations'
    );
  };

  // Purchase Order actions
  const generatePurchaseOrder = (
    quotationId: string,
    options?: { deliveryAddress?: string; paymentTerms?: string; notes?: string }
  ): PurchaseOrder => {
    const selectedQuo = quotations.find((q) => q.id === quotationId);
    if (!selectedQuo) throw new Error('Selected quotation not found');

    const vendor = vendors.find((v) => v.id === selectedQuo.vendorId);
    const relatedRFQ = rfqs.find((r) => r.id === selectedQuo.rfqId);
    const relatedPR = purchaseRequests.find((p) => p.id === relatedRFQ?.purchaseRequestId);

    const count = purchaseOrders.length + 1;
    const poNumber = `PO-2026-${String(count).padStart(4, '0')}`;
    const newPOId = `po-${Date.now()}`;

    const items = selectedQuo.items.map((it) => ({
      id: `poi-${Date.now()}-${it.id}`,
      item: it.item,
      description: `${it.item} per quotation ${selectedQuo.quotationNumber}`,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      subtotal: it.total,
    }));

    const newPO: PurchaseOrder = {
      id: newPOId,
      poNumber,
      purchaseRequestId: relatedPR?.id || selectedQuo.rfqId,
      purchaseRequestNumber: relatedPR?.requestNumber || 'PR-2026-REF',
      rfqId: selectedQuo.rfqId,
      rfqNumber: selectedQuo.rfqNumber,
      quotationId: selectedQuo.id,
      quotationNumber: selectedQuo.quotationNumber,
      vendorId: selectedQuo.vendorId,
      vendorName: selectedQuo.vendorName,
      vendorAddress: vendor
        ? `${vendor.address}, ${vendor.city}, ${vendor.state} - ${vendor.pincode}`
        : 'Vendor Registered Address',
      vendorGst: vendor?.gstNumber || '29ABCDE1234F1Z5',
      items,
      subtotal: selectedQuo.subtotal,
      taxRate: 18,
      taxAmount: selectedQuo.tax,
      totalAmount: selectedQuo.totalAmount,
      deliveryDate: new Date(Date.now() + selectedQuo.deliveryDays * 86400000)
        .toISOString()
        .split('T')[0],
      deliveryAddress:
        options?.deliveryAddress ||
        'Sourcelyx Enterprise Center, Cyber Tech Corridor, Bengaluru - 560103',
      paymentTerms: options?.paymentTerms || selectedQuo.paymentTerms,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'GENERATED',
      notes: options?.notes || 'Standard procurement contract terms apply.',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Update PR status to PO_GENERATED
    if (relatedPR) {
      setPurchaseRequests((prev) =>
        prev.map((pr) =>
          pr.id === relatedPR.id
            ? {
                ...pr,
                status: 'PO_GENERATED',
                poId: newPOId,
                updatedAt: new Date().toISOString(),
              }
            : pr
        )
      );

      // Update Department Budget committed spend
      setBudgets((prev) =>
        prev.map((b) =>
          b.departmentId === relatedPR.departmentId
            ? {
                ...b,
                committedSpend: b.committedSpend + newPO.totalAmount,
                availableBudget: Math.max(0, b.availableBudget - newPO.totalAmount),
              }
            : b
        )
      );
    }

    addAuditLog(
      'GENERATED_PURCHASE_ORDER',
      'PURCHASE_ORDER',
      newPOId,
      `Generated Purchase Order ${newPO.poNumber} for ₹${newPO.totalAmount.toLocaleString('en-IN')} issued to ${newPO.vendorName}.`
    );

    addNotification(
      'VENDOR',
      'Purchase Order Issued',
      `${newPO.poNumber} has been officially created and issued to your company for ${newPO.rfqNumber}.`,
      'SUCCESS',
      '/vendor/purchase-orders'
    );

    addNotification(
      'FINANCE',
      'Budget Spend Committed',
      `PO ${newPO.poNumber} committed spend of ₹${newPO.totalAmount.toLocaleString('en-IN')}.`,
      'INFO',
      '/finance/spend'
    );

    return newPO;
  };

  const sendPurchaseOrder = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status: 'SENT' } : po))
    );
    const po = purchaseOrders.find((p) => p.id === poId);
    if (po) {
      addAuditLog(
        'SENT_PURCHASE_ORDER',
        'PURCHASE_ORDER',
        poId,
        `Dispatched Purchase Order ${po.poNumber} to vendor ${po.vendorName}.`
      );
    }
  };

  const acknowledgePurchaseOrder = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status: 'ACKNOWLEDGED' } : po))
    );
    const po = purchaseOrders.find((p) => p.id === poId);
    if (po) {
      addAuditLog(
        'SYSTEM_UPDATE',
        'PURCHASE_ORDER',
        poId,
        `Vendor ${po.vendorName} formally acknowledged Purchase Order ${po.poNumber}.`
      );
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setVendors(INITIAL_VENDORS);
    setPurchaseRequests(INITIAL_PURCHASE_REQUESTS);
    setRfqs(INITIAL_RFQS);
    setQuotations(INITIAL_QUOTATIONS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setBudgets(INITIAL_BUDGETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        departments,
        vendors,
        purchaseRequests,
        rfqs,
        quotations,
        purchaseOrders,
        budgets,
        notifications,
        auditLogs,
        setCurrentUser,
        switchUserRole,
        registerVendor,
        verifyVendor,
        approveVendor,
        rejectVendor,
        createPurchaseRequest,
        approvePurchaseRequest,
        rejectPurchaseRequest,
        sendBackPurchaseRequest,
        createRFQ,
        submitQuotation,
        selectQuotation,
        generatePurchaseOrder,
        sendPurchaseOrder,
        acknowledgePurchaseOrder,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
