'use client';

import React, { useState } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useApp } from '../../../lib/context/AppContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Users, Search, Shield, UserPlus, Mail } from 'lucide-react';

export default function AdminUsersPage() {
  const { users, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      title="User Directory & Identity Management"
      subtitle="Manage internal personnel and their assigned enterprise RBAC roles"
      actions={
        <Button
          size="sm"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => alert('New user invitation modal: In this prototype, all 7 core role accounts are pre-configured.')}
        >
          Invite User
        </Button>
      }
    >
      <Card>
        {/* Search Bar */}
        <div className="mb-4 max-w-md">
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <Table>
          <TableHeader>
            <tr>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="purple">{u.role.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600 font-medium">{u.title || 'Staff'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 font-mono">
                    {u.departmentId ? u.departmentId.toUpperCase() : 'Central Org'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => alert(`Editing profile & permissions for ${u.name}`)}
                  >
                    Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AppShell>
  );
}
