"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Hash, Lock, ShieldCheck, ArrowRight, Loader2, UserCircle } from 'lucide-react';

export default function StudentLoginPage() {
  const [matricNo, setMatricNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Forces the student format: demo123 -> demo123@edu.ng
    const loginEmail = `${matricNo.trim().toLowerCase()}@edu.ng`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      // Better UX: Translate "Invalid credentials" to something student-specific
      setErrorMsg(error.message === "Invalid login credentials" 
        ? "Matric number or password incorrect." 
        : error.message);
      setLoading(false);
    } else if (data.user) {
      // Verify they are actually a student in the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'DOCTOR') {
        // Prevent doctors from using the student dashboard
        setErrorMsg("This portal is for students only. Please use the Staff Portal.");
        await supabase.auth.signOut();
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
          <ShieldCheck size={24} />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tight">DigiMed</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-full mb-4">
            <UserCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Student Portal</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Sign in with your Matric Number</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              required
              value={matricNo}
              onChange={(e) => setMatricNo(e.target.value)}
              placeholder="e.g. demo123"
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Access Dashboard <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-3">
          <p className="text-slate-500 font-bold text-sm">
            Are you Medical Staff?{' '}
            <Link href="/staff-login" className="text-blue-600 hover:underline">
              Go to Staff Portal
            </Link>
          </p>
          <p className="text-slate-400 text-xs font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-slate-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}