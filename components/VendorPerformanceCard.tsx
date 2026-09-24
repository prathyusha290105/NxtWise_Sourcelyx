import React from 'react';
import { VendorPerformance } from '../lib/types';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { Star, Truck, ShieldCheck, DollarSign, MessageSquare, CheckCircle } from 'lucide-react';

export interface VendorPerformanceCardProps {
  performance?: VendorPerformance;
  vendorName: string;
}

export const VendorPerformanceCard: React.FC<VendorPerformanceCardProps> = ({
  performance,
  vendorName,
}) => {
  if (!performance) {
    return (
      <Card>
        <p className="text-xs text-slate-500">No performance telemetry recorded yet for {vendorName}.</p>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'On-Time Delivery',
      value: `${performance.deliveryPerformance}%`,
      pct: performance.deliveryPerformance,
      icon: <Truck className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-600',
    },
    {
      label: 'Quality Score',
      value: `${performance.qualityRating} / 5.0`,
      pct: (performance.qualityRating / 5) * 100,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-600',
    },
    {
      label: 'Price Competitiveness',
      value: `${performance.priceCompetitiveness} / 5.0`,
      pct: (performance.priceCompetitiveness / 5) * 100,
      icon: <DollarSign className="w-4 h-4 text-indigo-500" />,
      color: 'bg-indigo-600',
    },
    {
      label: 'Vendor Response Rate',
      value: `${performance.responseRate}%`,
      pct: performance.responseRate,
      icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
      color: 'bg-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Supplier Performance Metrics</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">{vendorName}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm font-bold">
          <Star className="w-4 h-4 fill-amber-500" />
          <span>{performance.overallRating} / 5.0</span>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                {m.icon}
                {m.label}
              </span>
              <span className="font-bold text-slate-900">{m.value}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${m.color}`}
                style={{ width: `${Math.min(100, m.pct)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Total Orders Completed:
        </span>
        <span className="font-bold text-slate-800">{performance.totalOrdersCompleted} Orders</span>
      </div>
    </Card>
  );
};
