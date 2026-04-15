"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, UserCircle, Stethoscope, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role,setRole] = useState('student'); // Toggle between student and medical staff

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      {/* Logo Area */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ShieldCheck size={24} />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tight">DigiMed</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">Log in to manage your medical appointments</p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <UserCircle size={18} /> Student
            </button>
            <button
              onClick={() => setRole('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                role === 'staff' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Stethoscope size={18} /> Medical Staff
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder={role === 'student' ? "Matric Email (e.g. @edu.ng)" : "Staff Email"}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Enter Password"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-end">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              Sign In <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{' '}
              <button className="text-blue-600 font-bold hover:underline">Register here</button>
            </p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs">
        &copy; 2025 DigiMed University Health Systems
      </p>
    </div>
  );
}