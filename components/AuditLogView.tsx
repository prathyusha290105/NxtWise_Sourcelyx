'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/AppContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Badge } from './ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/Table';
import { EmptyState } from './ui/EmptyState';
import { formatDateTime } from '../lib/utils';
import { History, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { Button } from './ui/Button';

export const AuditLogView: React.FC<{ isAuditorView?: boolean }> = ({ isAuditorView }) => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === 'ALL' || log.entity === entityFilter;
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesEntity && matchesAction;
  });

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('APPROVED') || action.includes('SELECTED')) return 'success';
    if (action.includes('REJECTED')) return 'danger';
    if (action.includes('CREATED') || action.includes('GENERATED')) return 'purple';
    if (action.includes('VERIFIED')) return 'info';
    return 'default';
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,User,Role,Action,Entity,EntityID,Description,IP']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.entity}","${l.entityId}","${l.description}","${l.ipAddress || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sourcelyx_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:max-w-xs">
            <Input
              placeholder="Search description, user, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Select
              className="text-xs py-1.5 w-36"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Entities' },
                { value: 'VENDOR', label: 'Vendor' },
                { value: 'PURCHASE_REQUEST', label: 'Purchase Request' },
                { value: 'RFQ', label: 'RFQ' },
                { value: 'QUOTATION', label: 'Quotation' },
                { value: 'PURCHASE_ORDER', label: 'Purchase Order' },
              ]}
            />

            <Select
              className="text-xs py-1.5 w-44"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Actions' },
                { value: 'APPROVED_VENDOR', label: 'APPROVED VENDOR' },
                { value: 'REJECTED_VENDOR', label: 'REJECTED VENDOR' },
                { value: 'VERIFIED_VENDOR', label: 'VERIFIED VENDOR' },
                { value: 'REGISTERED_VENDOR', label: 'REGISTERED VENDOR' },
                { value: 'CREATED_PURCHASE_REQUEST', label: 'CREATED PR' },
                { value: 'APPROVED_PURCHASE_REQUEST', label: 'APPROVED PR' },
                { value: 'REJECTED_PURCHASE_REQUEST', label: 'REJECTED PR' },
                { value: 'CREATED_RFQ', label: 'CREATED RFQ' },
                { value: 'SUBMITTED_QUOTATION', label: 'SUBMITTED QUOTE' },
                { value: 'SELECTED_VENDOR', label: 'SELECTED VENDOR' },
                { value: 'GENERATED_PURCHASE_ORDER', label: 'GENERATED PO' },
              ]}
            />

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8 text-slate-400" />}
          title="No audit records found"
          description="Try broadening your search term or clearing entity/action filters."
        />
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Timestamp</TableHead>
              <TableHead>User & Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity & ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Source IP</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {log.userRole.replace('_', ' ')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                    {log.action.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono">
                    <span className="text-slate-500 text-[10px] block">{log.entity}</span>
                    <span className="font-bold text-slate-800">{log.entityId}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-xs text-slate-700 leading-snug break-words">
                    {log.description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-mono text-slate-400">
                    {log.ipAddress || '127.0.0.1'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
