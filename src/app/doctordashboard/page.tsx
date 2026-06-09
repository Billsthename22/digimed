"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Clock, ArrowRight, Activity, Search, Loader2, RefreshCw, ClipboardList, ChevronRight, CheckCircle2 } from 'lucide-react';
interface DoctorInfo {
  id: string;
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
  severity: number;
  department?: string;
  schoolDepartment?: string;
  reason?: string;
}

function decodeToken(token: string): DoctorInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nameParts = payload.fullName?.trim().split(' ') ?? [];
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0]?.[0]?.toUpperCase() ?? '?';
    return { id: payload.id, fullName: payload.fullName ?? 'Doctor', initials };
  } catch {
    return null;
  }
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'logs'>('queue');

  // Queue state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Logs state
  const [logs, setLogs] = useState<Appointment[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Appointment[]>([]);
  const [logsSearch, setLogsSearch] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    if (!token) { window.location.href = '/staff'; return; }
    const info = decodeToken(token);
    if (!info) { window.location.href = '/staff'; return; }
    setDoctor(info);
    fetchAppointments();
    fetchLogs(info.id);
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments(data.data);
      setFiltered(data.data);
    } catch {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (doctorId: string) => {
    try {
      setLoadingLogs(true);
      const res = await fetch(`/api/appointments/doctor?doctorId=${doctorId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLogs(data.data);
      setFilteredLogs(data.data);
    } catch {
      setLogsError('Failed to load medical logs');
    } finally {
      setLoadingLogs(false);
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

  const handleLogsSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setLogsSearch(query);
    setFilteredLogs(
      logs.filter(
        (a) =>
          a.studentName.toLowerCase().includes(query) ||
          a.matricNumber.toLowerCase().includes(query)
      )
    );
  };

  const getSeverityInfo = (severity: number) => {
    if (severity <= 3) return { color: 'bg-green-50 text-green-600 border-green-100', label: 'Low' };
    if (severity <= 7) return { color: 'bg-orange-50 text-orange-600 border-orange-100', label: 'Moderate' };
    return { color: 'bg-red-50 text-red-600 border-red-100', label: 'Urgent' };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0F1E3D] p-8 text-white flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Activity size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic">
            DigiMed <span className="text-blue-500">OS</span>
          </span>
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
          <button
            onClick={() => setActiveTab('queue')}
            className={`w-full text-left p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'queue'
                ? 'text-white bg-blue-600 shadow-xl shadow-blue-900/40'
                : 'text-slate-400 hover:bg-white/5'
              }`}
          >
            <Users size={16} /> Patient Queue
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'logs'
                ? 'text-white bg-blue-600 shadow-xl shadow-blue-900/40'
                : 'text-slate-400 hover:bg-white/5'
              }`}
          >
            <ClipboardList size={16} /> Medical Logs
          </button>
          <div className="text-slate-400 p-4 rounded-2xl hover:bg-white/5 transition cursor-pointer font-black text-[10px] uppercase tracking-[0.2em]">
            Management
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#0F1E3D] uppercase tracking-tighter italic leading-none mb-2">
              {activeTab === 'queue' ? "Doctor's Portal" : "Medical Logs"}
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Welcome back, Dr. {doctor?.fullName?.split(' ').slice(-1)[0] ?? '...'}
            </p>
          </div>

          <div className="flex gap-4">
            {activeTab === 'queue' && (
              <>
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
              </>
            )}
            {activeTab === 'logs' && (
              <>
                <div className="bg-white px-8 py-4 rounded-[2rem] border-2 border-slate-100 shadow-sm text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Seen</p>
                  <p className="text-2xl font-black text-green-600">{logs.length}</p>
                </div>
                <button
                  onClick={() => doctor && fetchLogs(doctor.id)}
                  className="bg-white p-4 rounded-[1.5rem] border-2 border-slate-100 shadow-sm hover:border-blue-600 transition-all active:scale-95"
                >
                  <RefreshCw size={20} className={`text-slate-400 ${loadingLogs ? 'animate-spin text-blue-600' : ''}`} />
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── PATIENT QUEUE TAB ── */}
        {activeTab === 'queue' && (
          <>
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

            {error && (
              <div className="mb-6 px-6 py-4 bg-red-50 border-2 border-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl">
                {error}
              </div>
            )}

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
                      {filtered.map((appointment) => {
                        const { color, label } = getSeverityInfo(appointment.severity ?? 1);
                        return (
                          <tr key={appointment._id} className="group hover:bg-blue-50/20 transition-all duration-300">
                            <td className="p-8">
                              <p className="font-black text-[#0F1E3D] uppercase italic tracking-tighter text-lg">
                                {appointment.studentName}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                                {appointment.matricNumber}
                              </p>
                            </td>
                            <td className="p-8">
                              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-[11px] font-black text-[#0F1E3D]">
                                <Clock size={14} className="text-blue-600" /> {appointment.time}
                              </div>
                            </td>
                            <td className="p-8">
                              <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${color}`}>
                                  {label}
                                </span>
                                <span className="text-xs font-black text-slate-400">
                                  {appointment.severity ?? 1}/10
                                </span>
                              </div>
                            </td>
                            <td className="p-8 text-right">
                              <Link
                                href={`/doctordashboard/consult?id=${appointment._id}`}
                                className="inline-flex items-center gap-3 bg-[#0F1E3D] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                              >
                                Attend <ArrowRight size={14} className="text-blue-400" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── MEDICAL LOGS TAB ── */}
        {activeTab === 'logs' && (
          <>
            <div className="mb-10 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="text"
                value={logsSearch}
                onChange={handleLogsSearch}
                placeholder="SEARCH BY NAME OR MATRIC NO..."
                className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-blue-600 outline-none placeholder:text-slate-300 text-[#0F1E3D] font-black text-[11px] tracking-widest uppercase transition-all"
              />
            </div>

            {logsError && (
              <div className="mb-6 px-6 py-4 bg-red-50 border-2 border-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl">
                {logsError}
              </div>
            )}

            <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-[#0F1E3D] uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                  <ClipboardList size={18} className="text-blue-600" /> Consultation History
                </h3>
                <span className="text-[9px] font-black text-slate-400 bg-white border-2 border-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">
                  {filteredLogs.length} Records
                </span>
              </div>

              {loadingLogs ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Loading Logs...</span>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 italic">
                    No Consultation History Yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/30">
                        <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                        <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                        <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                        <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                        <th className="p-8 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredLogs.map((log) => {
                        const { color, label } = getSeverityInfo(log.severity ?? 1);
                        return (
                          <tr key={log._id} className="hover:bg-blue-50/20 transition-all duration-300">
                            <td className="p-8">
                              <p className="font-black text-[#0F1E3D] uppercase italic tracking-tighter text-lg">
                                {log.studentName}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                                {log.matricNumber}
                              </p>
                            </td>
                            <td className="p-8">
                              <p className="font-bold text-slate-700 text-sm">{log.schoolDepartment ?? '—'}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">{log.department ?? '—'}</p>
                            </td>
                           <td className="p-8">
   <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-100 px-4 py-2 rounded-xl text-[11px] font-black text-green-700">
    <Clock size={14} className="text-green-600" /> {log.time}
  </div>
  <p className="text-[10px] font-bold text-slate-400 mt-2">{log.date}</p>
  <div className="inline-flex items-center gap-1 mt-2 text-green-600 text-[9px] font-black uppercase tracking-widest">
    <CheckCircle2 size={12} /> Attended
  </div>
</td>
                            <td className="p-8">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${color}`}>
                                  {label}
                                </span>
                                <span className="text-xs font-black text-slate-400">{log.severity ?? 1}/10</span>
                              </div>
                            </td>
                            <td className="p-8 text-right">
                              <Link
                                href={`/doctordashboard/consult?id=${log._id}`}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest transition-all"
                              >
                                View <ChevronRight size={14} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}