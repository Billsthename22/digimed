"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CreditCard, ArrowRight, ShieldPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    matricNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      router.push('/login');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6">
      {/* Logo Area */}
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ShieldPlus size={24} />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tight">DigiMed</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600 text-sm mt-2 font-medium">Join the university digital health portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* Matric Number */}
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="matricNumber"
                placeholder="Matric Number (e.g. 22CH031980)"
                value={form.matricNumber}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="University Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? 'Creating Account...' : <>Register Account <ArrowRight size={20} /></>}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-700 text-sm font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}