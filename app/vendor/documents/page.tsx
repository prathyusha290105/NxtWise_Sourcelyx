'use client';

import React from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../lib/utils';
import { FileText, ShieldCheck, Upload, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function VendorDocumentsPage() {
  const { vendors, currentUser } = useApp();

  const currentVendor =
    vendors.find((v) => v.id === currentUser.vendorId) ||
    vendors.find((v) => v.email === currentUser.email) ||
    vendors[0];

  return (
    <AppShell
      title="Statutory Compliance Document Vault"
      subtitle="Government certificates, GST filings, and verified banking instruments"
      actions={
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Upload className="w-4 h-4" />}
          onClick={() => alert('Document upload modal: Select replacement PDF for compliance renewal.')}
        >
          Upload New Document
        </Button>
      }
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentVendor.documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{doc.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.type.replace(/_/g, ' ')} • {doc.fileSize}
                    </p>
                  </div>
                </div>

                {doc.verified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Pending
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Uploaded {formatDate(doc.uploadedAt)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => alert(`Simulated document viewer for: ${doc.name}`)}
                  rightIcon={<ExternalLink className="w-3 h-3" />}
                >
                  View File
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
