"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, AlertTriangle, ArrowLeft, Calendar, Clock, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ExcuseSlip {
  _id: string;
  token: string;
  studentName: string;
  matricNumber: string;
  issuedBy: string;
  reason: string;
  department: string;
  schoolDepartment: string;
  dateIssued: string;
  expiryDate: string;
  validDays: number;
}

interface StudentInfo {
  id: string;
  fullName: string;
  matricNumber: string;
}

function decodeToken(token: string): StudentInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, fullName: payload.fullName, matricNumber: payload.matricNumber };
  } catch { return null; }
}

export default function SlipPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [slips, setSlips] = useState<ExcuseSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) { window.location.href = '/login'; return; }
    const info = decodeToken(token);
    if (!info) { window.location.href = '/login'; return; }
    setStudent(info);
    fetchSlips(info.id);
  }, []);

  const fetchSlips = async (studentId: string) => {
    try {
      const res = await fetch(`/api/excuseslip/student?studentId=${studentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSlips(data.data);
    } catch {
      setError('Failed to load excuse slips.');
    } finally {
      setLoading(false);
    }
  };

  const getVerifyUrl = (token: string) =>
    `${window.location.origin}/verify/${token}`;

  const getQRUrl = (token: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getVerifyUrl(token))}&bgcolor=ffffff&color=0f1e3d&qzone=2`;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <nav className="bg-white border-b-2 border-slate-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="text-slate-900 hover:text-blue-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-black text-slate-900">My Medical Excuse Slips</h1>
      </nav>

      <main className="max-w-3xl mx-auto p-6 space-y-8 mt-6">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-black uppercase tracking-widest text-xs">Loading slips...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-400">
            <AlertTriangle size={32} />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {!loading && !error && slips.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <ShieldCheck size={48} className="text-slate-300 mx-auto" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No excuse slips yet</p>
            <p className="text-slate-400 font-bold text-sm">
              Excuse slips are issued by your doctor after a consultation.
            </p>
          </div>
        )}

        {!loading && slips.map((slip) => (
          <div key={slip._id} className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl overflow-hidden">

            {/* Slip Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-8 flex justify-between items-start">
              <div>
                <p className="text-blue-300 font-black text-[9px] uppercase tracking-widest mb-2">
                  DigiMed University Health System
                </p>
                <h2 className="text-2xl font-black text-white uppercase italic">Medical Excuse Slip</h2>
                <p className="text-blue-200 font-bold text-sm mt-1">Valid for {slip.validDays} days</p>
              </div>
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <Image
                  src={getQRUrl(slip.token)}
                  alt="Verification QR Code"
                  width={100}
                  height={100}
                  className="rounded-xl"
                  unoptimized
                />
              </div>
            </div>

            {/* Slip Body */}
            <div className="p-8 space-y-6">

              {/* Student */}
              <div className="flex items-center gap-4 pb-6 border-b-2 border-slate-50">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                  {slip.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xl">{slip.studentName}</p>
                  <p className="text-slate-400 font-bold">{slip.matricNumber}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">School Department</p>
                  <p className="font-black text-slate-900">{slip.schoolDepartment}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Service</p>
                  <p className="font-black text-slate-900">{slip.department}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar size={10} /> Date Issued
                  </p>
                  <p className="font-black text-slate-900">{slip.dateIssued}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock size={10} /> Valid Until
                  </p>
                  <p className="font-black text-slate-900">{slip.expiryDate}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason for Absence</p>
                  <p className="font-bold text-slate-700 leading-relaxed">{slip.reason}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Stethoscope size={10} /> Issued By
                  </p>
                  <p className="font-black text-slate-900">Dr. {slip.issuedBy?.split(' ').slice(-1)[0]}</p>
                </div>
              </div>

              {/* Verification info */}
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-600" />
                  <p className="font-black text-blue-700 text-sm">How to verify this slip</p>
                </div>
                <p className="text-blue-600 font-bold text-xs leading-relaxed">
                  Ask your lecturer or school authority to scan the QR code above. It will open a verification page confirming this slip is genuine and linked to the DigiMed database.
                </p>
                <p className="text-blue-400 font-bold text-[10px] break-all">
                  {typeof window !== 'undefined' ? getVerifyUrl(slip.token) : ''}
                </p>
              </div>

            </div>
          </div>
        ))}
      </main>
    </div>
  );
}