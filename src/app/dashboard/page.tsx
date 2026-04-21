"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, FileCheck, Pill, MessageCircle, ArrowRight, QrCode, PlusCircle, Loader2 } from 'lucide-react';

interface StudentInfo {
  id: string;
  fullName: string;
  matricNumber: string;
  initials: string;
}

interface Appointment {
  _id: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

function decodeToken(token: string): StudentInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nameParts = payload.fullName?.trim().split(' ') ?? [];
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0]?.[0]?.toUpperCase() ?? '?';
    return {
      id: payload.id,
      fullName: payload.fullName ?? 'Student',
      matricNumber: payload.matricNumber ?? '',
      initials,
    };
  } catch {
    return null;
  }
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const info = decodeToken(token);
    if (!info) { window.location.href = '/login'; return; }
    setStudent(info);
    fetchAppointment(info.id);
  }, []);

  const fetchAppointment = async (studentId: string) => {
    try {
      const res = await fetch(`/api/appointments/student?studentId=${studentId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setAppointment(data.data);
        setQueuePosition(data.queuePosition);
      }
    } catch {
      // silently fail — just show no appointment state
    } finally {
      setLoadingAppointment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">DigiMed Portal</h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block text-slate-900">
            <p className="text-sm font-black">{student?.fullName ?? '...'}</p>
            <p className="text-xs font-bold opacity-70">{student?.matricNumber ?? ''}</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black shadow-md">
            {student?.initials ?? '...'}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">

        {/* HERO SECTION */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
          <QrCode className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48 -rotate-12" />

          {/* Loading */}
          {loadingAppointment && (
            <div className="flex items-center gap-3 text-blue-100">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-bold">Loading your appointment...</span>
            </div>
          )}

          {/* No appointment */}
          {!loadingAppointment && !appointment && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">No Upcoming Visit</p>
                <h2 className="text-3xl font-black mb-2 tracking-tight">You have no active appointment</h2>
                <p className="text-blue-100 text-sm font-bold">Book a slot to see a doctor today.</p>
              </div>
              <Link
                href="/book"
                className="bg-white text-blue-700 px-6 py-4 rounded-2xl font-black hover:bg-blue-50 transition shadow-lg active:scale-95 whitespace-nowrap"
              >
                Book Now
              </Link>
            </div>
          )}

          {/* Active appointment */}
          {!loadingAppointment && appointment && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Your Next Visit</p>
               <h2 className="text-4xl font-black mb-3 tracking-tight">
                     {appointment.time} — Dr. {appointment.doctorName}
               </h2>
                <div className="flex flex-wrap items-center gap-4 text-blue-50">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Calendar size={16} /> {appointment.date}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Clock size={16} /> Queue Position: #{queuePosition}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    appointment.status === 'Waiting'
                      ? 'bg-orange-400/30 text-orange-100 border border-orange-300'
                      : 'bg-blue-400/30 text-blue-100 border border-blue-300'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => fetchAppointment(student!.id)}
                  className="bg-white/20 hover:bg-white/30 text-white px-5 py-4 rounded-2xl font-black transition border border-white/30"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm border-t-8 border-t-blue-600">
              <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" /> Need a Doctor?
              </h3>
              <p className="text-sm font-bold text-slate-900 opacity-60 mb-6">
                Feeling unwell? Secure a slot now to avoid the clinic queue.
              </p>
              <Link
                href="/book"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                BOOK APPOINTMENT <ArrowRight size={18} />
              </Link>
            </div>

            <h3 className="font-black text-slate-900 text-xl tracking-tight">Support</h3>
            <div className="grid gap-4">
              <Link href="/dashboard/chat" className="flex items-center gap-4 p-5 bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 transition text-left group shadow-sm">
                <div className="bg-green-100 text-green-700 p-3 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-900">Consult Doctor</div>
                  <div className="text-xs font-bold text-slate-900 opacity-60">Chat for minor concerns</div>
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Your Health Records</h3>
            <div className="bg-white rounded-[2rem] border-2 border-slate-200 overflow-hidden shadow-sm">

              <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center hover:bg-slate-50 transition">
                <div className="flex items-center gap-5">
                  <div className="bg-orange-100 text-orange-700 p-4 rounded-2xl border border-orange-200">
                    <Pill size={28} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-lg">Amoxicillin + Paracetamol</div>
                    <div className="text-sm font-bold text-slate-900 opacity-50">Prescribed: Jan 18, 2026</div>
                  </div>
                </div>
                <span className="bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                  Ready for Pickup
                </span>
              </div>

              <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-5 w-full">
                  <div className="bg-blue-100 text-blue-700 p-4 rounded-2xl border border-blue-200">
                    <FileCheck size={28} />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-lg">Medical Excuse Duty</div>
                    <div className="text-sm font-bold text-slate-900 opacity-60">Valid until Jan 20, 2026</div>
                  </div>
                </div>
                <Link
                  href="/dashboard/slip"
                  className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                >
                  VIEW QR <QrCode size={16} />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}