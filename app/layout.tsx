import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../lib/context/AppContext';

export const metadata: Metadata = {
  title: 'Sourcelyx — Enterprise Procurement & Spend Control',
  description: 'Enterprise Vendor Onboarding, Multi-Tier Approval Workflow, RFQ & Spend Control Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
