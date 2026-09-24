'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../lib/context/AppContext';
import { Role } from '../lib/types';
import { getDefaultDashboardRoute } from '../lib/permissions';
import { NotificationDropdown } from './NotificationDropdown';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  CheckSquare,
  SendHorizontal,
  Layers,
  FileCheck2,
  PieChart,
  Wallet,
  Coins,
  History,
  Activity,
  Menu,
  X,
  ChevronDown,
  LogOut,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export const AppShell: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ children, title, subtitle, actions }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUserRole, resetToDemoData, users, purchaseRequests, vendors } =
    useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Pending counts for badges
  const pendingApprovalsCount = purchaseRequests.filter(
    (pr) => pr.status === 'PENDING_APPROVAL'
  ).length;
  const pendingVendorVerificationsCount = vendors.filter(
    (v) => v.status === 'PENDING_VERIFICATION' || v.status === 'PENDING_APPROVAL'
  ).length;

  // Build role-specific navigation according to Section 26
  const getNavItems = (role: Role): NavItem[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
          { label: 'Roles & Permissions', href: '/admin/roles', icon: <ShieldCheck className="w-4 h-4" /> },
          {
            label: 'Vendors',
            href: '/admin/vendors',
            icon: <Building2 className="w-4 h-4" />,
            badge: pendingVendorVerificationsCount > 0 ? pendingVendorVerificationsCount : undefined,
          },
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
        ];

      case 'PROCUREMENT':
      case 'PROCUREMENT_MANAGER':
        return [
          { label: 'Dashboard', href: '/procurement/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          {
            label: 'Vendors',
            href: '/procurement/vendors',
            icon: <Building2 className="w-4 h-4" />,
            badge: pendingVendorVerificationsCount > 0 ? pendingVendorVerificationsCount : undefined,
          },
          { label: 'Purchase Requests', href: '/procurement/purchase-requests', icon: <FileText className="w-4 h-4" /> },
          {
            label: 'Approvals',
            href: '/procurement/approvals',
            icon: <CheckSquare className="w-4 h-4" />,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          },
          { label: 'RFQs', href: '/procurement/rfqs', icon: <SendHorizontal className="w-4 h-4" /> },
          { label: 'Quotations', href: '/procurement/quotations', icon: <Layers className="w-4 h-4" /> },
          { label: 'Purchase Orders', href: '/procurement/purchase-orders', icon: <FileCheck2 className="w-4 h-4" /> },
          { label: 'Analytics', href: '/procurement/analytics', icon: <PieChart className="w-4 h-4" /> },
        ];

      case 'FINANCE':
        return [
          { label: 'Dashboard', href: '/finance/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Budgets', href: '/finance/budgets', icon: <Wallet className="w-4 h-4" /> },
          { label: 'Spend Tracking', href: '/finance/spend', icon: <Coins className="w-4 h-4" /> },
        ];

      case 'DEPARTMENT_MANAGER':
        return [
          { label: 'Dashboard', href: '/manager/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Purchase Requests', href: '/manager/purchase-requests', icon: <FileText className="w-4 h-4" /> },
          {
            label: 'Approvals',
            href: '/manager/approvals',
            icon: <CheckSquare className="w-4 h-4" />,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          },
        ];

      case 'VENDOR':
        return [
          { label: 'Dashboard', href: '/vendor/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Company Profile', href: '/vendor/profile', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Documents', href: '/vendor/documents', icon: <FileText className="w-4 h-4" /> },
          { label: 'Assigned RFQs', href: '/vendor/rfqs', icon: <SendHorizontal className="w-4 h-4" /> },
          { label: 'Quotations', href: '/vendor/quotations', icon: <Layers className="w-4 h-4" /> },
          { label: 'Purchase Orders', href: '/vendor/purchase-orders', icon: <FileCheck2 className="w-4 h-4" /> },
        ];

      case 'AUDITOR':
        return [
          { label: 'Dashboard', href: '/auditor/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Audit Logs', href: '/auditor/audit-logs', icon: <History className="w-4 h-4" /> },
          { label: 'Procurement Activity', href: '/auditor/procurement-activity', icon: <Activity className="w-4 h-4" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(currentUser.role);

  const handleRoleSelect = (role: Role) => {
    switchUserRole(role);
    setIsRoleMenuOpen(false);
    const dest = getDefaultDashboardRoute(role);
    router.push(dest);
  };

  const roleColors: Record<Role, string> = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
    PROCUREMENT: 'bg-blue-100 text-blue-800 border-blue-200',
    PROCUREMENT_MANAGER: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    FINANCE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    DEPARTMENT_MANAGER: 'bg-amber-100 text-amber-800 border-amber-200',
    VENDOR: 'bg-orange-100 text-orange-800 border-orange-200',
    AUDITOR: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0">
              S
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  Sourcelyx
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-0.5">
                  Procurement Hub
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        {isSidebarOpen && (
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">
              Active Context
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                {currentUser.role.replace('_', ' ')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
                {isSidebarOpen && item.badge !== undefined && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Demo Switcher Helper */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-300">Quick Persona Switch</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSelect('PROCUREMENT')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Procurement
              </button>
              <button
                onClick={() => handleRoleSelect('PROCUREMENT_MANAGER')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Proc. Mgr
              </button>
              <button
                onClick={() => handleRoleSelect('DEPARTMENT_MANAGER')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Dept Mgr
              </button>
              <button
                onClick={() => handleRoleSelect('VENDOR')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Vendor
              </button>
              <button
                onClick={() => handleRoleSelect('FINANCE')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium"
              >
                Finance
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between z-20 shadow-xs">
          {/* Left: Mobile trigger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Sourcelyx
                </Link>
                <span>/</span>
                <span className="capitalize text-slate-700 font-semibold">
                  {currentUser.role.toLowerCase().replace('_', ' ')}
                </span>
                <span>/</span>
                <span className="text-slate-900 font-bold">{title || 'Dashboard'}</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  roleColors[currentUser.role]
                }`}
              >
                <span>Role: {currentUser.role.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.role}
                      onClick={() => handleRoleSelect(u.role)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                        currentUser.role === u.role ? 'bg-indigo-50/70 font-bold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.role.replace('_', ' ')}</div>
                      </div>
                      {currentUser.role === u.role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* User Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-xs"
                />
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{currentUser.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Public Landing Page
                  </Link>
                  <button
                    onClick={() => {
                      resetToDemoData();
                      setIsUserMenuOpen(false);
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50 transition-colors text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    Reset to Demo Data
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Switch User / Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Header (Title + Action buttons) */}
        {(title || actions) && (
          <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div>
              {title && <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>}
              {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/60">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-slate-900 text-white flex flex-col p-4 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-black text-lg">Sourcelyx Hub</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
