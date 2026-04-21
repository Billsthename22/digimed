"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Clock, ArrowRight, Activity, Search, Loader2 } from 'lucide-react';

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

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 p-6 text-white flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <span className="text-xl font-bold">DigiMed Staff</span>
        </div>

        <div className="flex items-center gap-3 mb-10 p-4 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
            {doctor?.initials ?? '..'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate">{doctor?.fullName ?? '...'}</p>
            <p className="text-xs font-bold text-slate-400">Medical Doctor</p>
          </div>
        </div>

        <nav className="space-y-4">
          <div className="text-blue-400 bg-blue-600/10 p-3 rounded-xl font-bold">Patient Queue</div>
          <div className="text-slate-400 p-3 rounded-xl hover:bg-slate-800 transition cursor-pointer">Schedule Manager</div>
          <div className="text-slate-400 p-3 rounded-xl hover:bg-slate-800 transition cursor-pointer">History Logs</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Doctor's Portal</h1>
            <p className="text-slate-600 font-bold">
              Welcome back, {doctor?.fullName ? `Dr. ${doctor.fullName.split(' ').slice(-1)[0]}` : '...'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Queue</p>
              <p className="text-xl font-black text-blue-600">{appointments.length}</p>
            </div>
            <button
              onClick={fetchAppointments}
              className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center hover:border-blue-400 transition"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refresh</p>
              <p className="text-xl font-black text-slate-700">↻</p>
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search student by name or matric number..."
            className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400 text-slate-900 font-bold"
          />
        </div>

        {/* Queue Table */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm flex items-center gap-2">
              <Users size={18} /> Live Appointments
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-white border px-3 py-1 rounded-full">
              {filtered.length} Students Waiting
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="animate-spin" size={24} />
              <span className="font-bold">Loading appointments...</span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-20 text-red-500 font-bold">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-bold">
              No appointments in the queue right now.
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Student Details</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Date</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Appt. Time</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase">Status</th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appointment) => (
                    <tr key={appointment._id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                      <td className="p-6">
                        <p className="font-black text-slate-900">{appointment.studentName}</p>
                        <p className="text-xs font-bold text-slate-500">{appointment.matricNumber}</p>
                      </td>
                      <td className="p-6 font-bold text-slate-700">{appointment.date}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Clock size={16} /> {appointment.time}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${appointment.status === 'Waiting'
                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <Link
                          href={`/doctor/consult?id=${appointment._id}`}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                        >
                          Attend <ArrowRight size={16} />
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