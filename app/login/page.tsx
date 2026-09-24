'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../lib/context/AppContext';
import { authService } from '../../services/authService';
import { getDefaultDashboardRoute } from '../../lib/permissions';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { DEMO_PASSWORD } from '../../lib/mock-data/users';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, users } = useApp();

  const [email, setEmail] = useState('admin@sourcelyx.com');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      if (!user) {
        setError('Invalid credentials. Use any of the listed demo emails with password: ' + DEMO_PASSWORD);
        setIsLoading(false);
        return;
      }

      setCurrentUser(user);
      const redirectPath = getDefaultDashboardRoute(user.role);
      router.push(redirectPath);
    } catch {
      setError('An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/40">
            S
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Sourcelyx
          </span>
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="text-xs text-slate-400 mt-1.5">
          Select a demo persona or enter credentials below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-slate-100">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sourcelyx.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Log In to Portal
            </Button>
          </form>

          {/* Quick Demo Credentials Matrix */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                1-Click Demo Personas
              </span>
              <span className="text-[11px] text-slate-400 font-mono">pwd: {DEMO_PASSWORD}</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = email === u.email;
                return (
                  <button
                    key={u.role}
                    type="button"
                    onClick={() => handleQuickFill(u.email)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold uppercase text-slate-600">
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/vendor/register"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Looking to partner? Register as a Supplier &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
