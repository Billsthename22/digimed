"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Clock, ArrowRight, Activity, Search, Loader2, RefreshCw } from 'lucide-react';

interface DoctorInfo {
  fullName: string;
  initials: string;
}

interface Appointment {
  _id: string;
  studentName: string;
  matricNumber: string;
  date: string;
  time: string;
  status: "Waiting" | "In-Queue" | "Attended" | "Cancelled";
}

function decodeToken(token: string): DoctorInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nameParts = payload.fullName?.trim().split(' ') ?? [];
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0]?.[0]?.toUpperCase() ?? '?';
    return { fullName: payload.fullName ?? 'Doctor', initials };
  } catch {
    return null;
  }
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/staff'; return; }
    const info = decodeToken(token);
    if (!info) { window.location.href = '/staff'; return; }
    setDoctor(info);
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments(data.data);
      setFiltered(data.data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFiltered(
      appointments.filter(
        (a) =>
          a.studentName.toLowerCase().includes(query) ||
          a.matricNumber.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

      {/* Sidebar - Tactical Dark Theme */}
      <aside className="w-full lg:w-72 bg-[#0F1E3D] p-8 text-white flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Activity size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic">DigiMed <span className="text-blue-500">OS</span></span>
        </div>

        <div className="flex items-center gap-4 mb-12 p-5 bg-white/5 rounded-3xl border border-white/10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
            {doctor?.initials ?? '..'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Medical Staff</p>
            <p className="text-sm font-black text-white truncate uppercase italic">{doctor?.fullName ?? '...'}</p>
          </div>
        </div>

        <nav className="space-y-3">
          <div className="text-white bg-blue-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 flex items-center gap-3">
            <Users size={16} /> Patient Queue
          </div>
          <div className="text-slate-400 p-4 rounded-2xl hover:bg-white/5 transition cursor-pointer font-black text-[10px] uppercase tracking-[0.2em]">Management</div>
          <div className="text-slate-400 p-4 rounded-2xl hover:bg-white/5 transition cursor-pointer font-black text-[10px] uppercase tracking-[0.2em]">Medical Logs</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#0F1E3D] uppercase tracking-tighter italic leading-none mb-2">Doctor's Portal</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Operational Overview • Live Queue</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-8 py-4 rounded-[2rem] border-2 border-slate-100 shadow-sm text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">In Waiting</p>
              <p className="text-2xl font-black text-blue-600">{appointments.length}</p>
            </div>
            <button
              onClick={fetchAppointments}
              className="bg-white p-4 rounded-[1.5rem] border-2 border-slate-100 shadow-sm hover:border-blue-600 transition-all active:scale-95"
            >
              <RefreshCw size={20} className={`text-slate-400 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Tactical Search */}
        <div className="mb-10 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="FILTER BY NAME OR MATRIC NO..."
            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-blue-600 outline-none placeholder:text-slate-300 text-[#0F1E3D] font-black text-[11px] tracking-widest uppercase transition-all"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-[#0F1E3D] uppercase tracking-[0.2em] text-xs flex items-center gap-3">
              <Users size={18} className="text-blue-600" /> Patient Manifest
            </h3>
            <span className="text-[9px] font-black text-slate-400 bg-white border-2 border-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">
              {filtered.length} Records Found
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing Records...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 italic">No Patients in Queue</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                    <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                    <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                    <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((appointment) => (
                    <tr key={appointment._id} className="group hover:bg-blue-50/20 transition-all duration-300">
                      <td className="p-8">
                        <p className="font-black text-[#0F1E3D] uppercase italic tracking-tighter text-lg">{appointment.studentName}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest">{appointment.matricNumber}</p>
                      </td>
                      <td className="p-8">
                        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-[11px] font-black text-[#0F1E3D]">
                          <Clock size={14} className="text-blue-600" /> {appointment.time}
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${
                            appointment.status === 'Waiting'
                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <Link
                          href={`/doctordashboard/consult?id=${appointment._id}`}
                          className="inline-flex items-center gap-3 bg-[#0F1E3D] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:-translate-x-1 transition-all shadow-lg active:scale-95"
                        >
                          Attend <ArrowRight size={14} className="text-blue-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}