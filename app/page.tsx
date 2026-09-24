'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  SendHorizontal,
  Layers,
  Coins,
  History,
  Building2,
  TrendingUp,
  Clock,
  Lock,
  ChevronRight,
  BarChart3,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const lifecycleSteps = [
    { title: 'Vendor Registration', desc: 'Self-service portal for GST & bank compliance registration.' },
    { title: 'Procurement Verification', desc: 'Officers review statutory trade documents and validity.' },
    { title: 'Admin Final Approval', desc: 'Administrative signoff creates an Active onboarded supplier.' },
    { title: 'Purchase Requisition', desc: 'Department heads raise requests with line-item budgets.' },
    { title: 'Amount-Based Approval', desc: 'Multi-tier workflow (₹25k, ₹1Lakh) routes automatically.' },
    { title: 'RFQ Publishing', desc: 'Procurement issues competitive quote requests to approved vendors.' },
    { title: 'Vendor Quotations', desc: 'Suppliers bid online with delivery times and pricing terms.' },
    { title: 'Quotation Comparison', desc: 'Side-by-side matrices highlight differences for informed decisions.' },
    { title: 'Purchase Order Generation', desc: 'Binding commercial PO issued with unique numbers and audit trail.' },
  ];

  const features = [
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: 'Vendor Onboarding & Verification',
      description: 'Streamlined GST, PAN, bank statement and compliance document checks with automated approval workflows.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Configurable Approval Automation',
      description: 'Dynamic approval routing based on transaction values (₹0–₹25k, ₹25k–₹1L, >₹1L) keeping every rupee authorized.',
    },
    {
      icon: <SendHorizontal className="w-6 h-6 text-blue-600" />,
      title: 'RFQ & Quotation Comparison',
      description: 'Invite approved suppliers to submit competitive bids. Compare price, turnaround, and credit terms side-by-side.',
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: 'Purchase Order Issuance',
      description: 'Only authorized procurement officers can generate binding POs with automatic serial tracking and PDF export.',
    },
    {
      icon: <Coins className="w-6 h-6 text-amber-600" />,
      title: 'Spend & Budget Control',
      description: 'Track department budget allocations, committed spend, and real-time available balances to prevent budget overruns.',
    },
    {
      icon: <History className="w-6 h-6 text-rose-600" />,
      title: 'Immutable Audit Trail & Analytics',
      description: 'Timestamped records of every approval, rejection, bid selection, and PO generation accessible to auditors.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
                Sourcelyx
              </span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                Enterprise Procurement
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#lifecycle" className="hover:text-white transition-colors">
              Lifecycle
            </a>
            <a href="#benefits" className="hover:text-white transition-colors">
              Benefits
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Log In
              </Button>
            </Link>
            <Link href="/vendor/register">
              <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25">
                Register as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Enterprise-Grade Procurement Governance & Compliance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Simplify Procurement. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-purple-400">
              Control Spend.
            </span>{' '}
            Build Better Vendor Relationships.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            Centralize your entire purchasing operations — from statutory vendor onboarding,
            multi-tier approval hierarchies and RFQs, to side-by-side quotation comparison and
            purchase order generation with real-time budget tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 shadow-xl shadow-indigo-600/30"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Access Platform Demo
              </Button>
            </Link>
            <Link href="/vendor/register" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                leftIcon={<Building2 className="w-5 h-5 text-indigo-400" />}
              >
                Register as Vendor
              </Button>
            </Link>
          </div>

          {/* Quick Demo Credentials Preview Pill */}
          <div className="mt-12 p-3.5 max-w-xl mx-auto rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-slate-300">Pre-configured Demo Personas:</span>
            <span className="bg-slate-700/60 px-2 py-0.5 rounded text-indigo-300 font-mono">admin@sourcelyx.com</span>
            <span className="bg-slate-700/60 px-2 py-0.5 rounded text-indigo-300 font-mono">procurement@sourcelyx.com</span>
            <span className="bg-slate-700/60 px-2 py-0.5 rounded text-indigo-300 font-mono">vendor@sourcelyx.com</span>
          </div>
        </div>
      </section>

      {/* Procurement Lifecycle Section */}
      <section id="lifecycle" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              End-to-End Orchestration
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              The Complete Procurement Lifecycle
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Sourcelyx eliminates spreadsheets, unapproved spending, and email trails with a verified
              sequential chain of custody.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifecycleSteps.map((step, idx) => (
              <div
                key={step.title}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-black text-indigo-400 font-mono">
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Step {idx + 1} of 9
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Platform Modules
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Features Built for Scale
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Everything required to run procurement governance across multiple departments and hundreds of vendors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="p-7 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-sm">
                  {feat.icon}
                </div>
                <h4 className="text-base font-bold text-white">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                Measurable ROI
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Designed to Stop Maverick Spending Before It Happens
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Organizations without formalized spend governance lose up to 18% of procurement budgets
                to unnegotiated pricing and duplicate purchases. Sourcelyx enforces automated checks
                at every tier.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">100% Tax & Statutory Compliance</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify GST and PAN records before any purchase requisition or RFQ can invite a supplier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Transparent Price Discovery</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Side-by-side matrices ensure quotes are evaluated systematically on price, turnaround, and credit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Auditor-Ready Trail</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Every comment, revision, signoff, and document upload is logged with user identities and timestamps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 shadow-2xl">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
                Standard Value Tiers
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>₹0 – ₹25,000</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Tier 1: Dept Manager
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct departmental signoff for rapid operational requirements and standard supplies.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>₹25,001 – ₹1,00,000</span>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      Tier 2: Dept + Procurement Mgr
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Dual verification ensuring departmental budget check followed by central procurement clearance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>Above ₹1,00,000</span>
                    <span className="text-xs font-semibold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      Tier 3: Executive / Finance
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Configurable enterprise threshold incorporating executive and financial controller signoffs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer id="about" className="mt-auto bg-slate-950 border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <div>
                <div className="text-base font-black text-white">Sourcelyx</div>
                <div className="text-xs text-slate-500">NxtWise IT Internship Project Prototype</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-white">
                  Demo Login
                </Button>
              </Link>
              <Link href="/vendor/register">
                <Button size="sm" variant="primary">
                  Vendor Onboarding
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>© 2026 Sourcelyx Technologies. All rights reserved. Configured for PostgreSQL + Prisma migration.</div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Whitepaper</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
