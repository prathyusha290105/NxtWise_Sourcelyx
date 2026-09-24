import { PurchaseRequest, Role } from '../lib/types';
import { canUserApproveAtStep } from '../lib/approvalRules';

export const approvalService = {
  getPendingForRole: (requests: PurchaseRequest[], role: Role): PurchaseRequest[] => {
    return requests.filter((pr) => {
      if (pr.status !== 'PENDING_APPROVAL') return false;
      return canUserApproveAtStep(role, pr.currentApprovalLevel, pr.approvals);
    });
  },
};
