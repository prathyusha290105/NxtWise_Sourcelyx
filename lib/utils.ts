import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'SELECTED':
    case 'COMPLETED':
    case 'VERIFIED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };

    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'PENDING_VERIFICATION':
    case 'UNDER_REVIEW':
    case 'OPEN':
    case 'SUBMITTED':
    case 'GENERATED':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };

    case 'RFQ_CREATED':
    case 'PO_GENERATED':
    case 'SENT':
    case 'ACKNOWLEDGED':
    case 'SHORTLISTED':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };

    case 'REJECTED':
    case 'CANCELLED':
    case 'INACTIVE':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };

    case 'DRAFT':
    case 'SENT_BACK':
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
  }
}

export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}
