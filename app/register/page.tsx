"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CreditCard, ArrowRight, ShieldPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  // 1. State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    email: '',
    password: '',
    role: 'STUDENT' // Default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit to our API Route
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Transform Matric Number to the "System Email" used for Login
    // This makes it so Matric Number '22CH031980' becomes '22CH031980@edu.ng'
    const systemEmail = `${formData.matricNumber.trim().toUpperCase()}@edu.ng`;

    const finalData = {
      ...formData,
      email: systemEmail, // Use the generated email instead of the input email
      originalEmail: formData.email // Optional: keep their real email in metadata
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      alert(`Registration successful! Your login ID is your Matric Number.`);
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6">
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="fullName"
                type="text" 
                required
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Matric Number (Metadata for your smart scheduling) */}
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="matricNumber"
                type="text" 
                required
                onChange={handleChange}
                placeholder="Matric Number (e.g. 22CH031980)"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="email"
                type="email" 
                required
                onChange={handleChange}
                placeholder="University Email Address"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="password"
                type="password" 
                required
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Register Account <ArrowRight size={20} /></>}
              </button>
            </div>
          </form>

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