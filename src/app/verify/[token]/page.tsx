"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, ShieldX, User, Calendar, Clock, Stethoscope, BookOpen, Loader2, AlertTriangle } from 'lucide-react';

interface ExcuseSlip {
  studentName: string;
  matricNumber: string;
  issuedBy: string;
  reason: string;
  department: string;
  schoolDepartment: string;
  dateIssued: string;
  expiryDate: string;
  validDays: number;
  createdAt: string;
}

export default function VerifySlipPage() {
  const params = useParams();
  const token = params.token as string;

  const [slip, setSlip] = useState<ExcuseSlip | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!token) return;
    verifySlip();
  }, [token]);

  const verifySlip = async () => {
    try {
      const res = await fetch(`/api/excuseslip/verify/${token}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSlip(data.data);
        setValid(true);
      } else {
        setValid(false);
      }
    } catch {
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-black uppercase tracking-widest text-sm">Verifying slip...</p>
        </div>
      </div>
    );
  }

  if (!valid || !slip) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border-4 border-red-200 p-10 text-center space-y-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldX size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-red-600 uppercase tracking-tight">Invalid Slip</h1>
          <p className="text-slate-600 font-bold">
            This medical excuse slip could not be verified. It may have been forged, tampered with, or does not exist in our system.
          </p>
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-3 text-left">
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-600 font-bold text-sm">
              Please report this to the university clinic immediately.
            </p>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            DigiMed University Health System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">

        {/* Verified Badge */}
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-green-200 p-10 text-center space-y-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-green-600 uppercase tracking-tight">Verified Genuine</h1>
          <p className="text-slate-500 font-bold text-sm">
            This medical excuse slip is authentic and exists in the DigiMed system.
          </p>
        </div>

        {/* Slip Details */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-center">
            <p className="text-blue-300 font-black text-[10px] uppercase tracking-widest mb-2">
              DigiMed University Health System
            </p>
            <h2 className="text-2xl font-black text-white uppercase italic">Medical Excuse Slip</h2>
          </div>

          {/* Student */}
          <div className="p-8 border-b-2 border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                {slip.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-black text-slate-900 text-xl uppercase italic">{slip.studentName}</p>
                <p className="text-slate-400 font-bold text-sm">{slip.matricNumber}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <BookOpen size={12} /> School Department
              </div>
              <p className="font-black text-slate-900">{slip.schoolDepartment}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Stethoscope size={12} /> Clinic Service
              </div>
              <p className="font-black text-slate-900">{slip.department}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar size={12} /> Date Issued
              </div>
              <p className="font-black text-slate-900">{slip.dateIssued}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={12} /> Valid Until
              </div>
              <p className="font-black text-slate-900">{slip.expiryDate}</p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <User size={12} /> Reason for Absence
              </div>
              <p className="font-bold text-slate-700 leading-relaxed">{slip.reason}</p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Stethoscope size={12} /> Issuing Medical Personnel
              </div>
              <p className="font-black text-slate-900">Dr. {slip.issuedBy?.split(' ').slice(-1)[0]}</p>
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-green-600 shrink-0" />
              <p className="text-green-700 font-bold text-xs">
                This slip is cryptographically linked to the DigiMed database and cannot be forged or reused.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          DigiMed · University Health System · Verified {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}