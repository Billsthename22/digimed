"use client";
import React from 'react';
import Link from 'next/link';
import { Users, Clock, CheckCircle, ArrowRight, Activity, Search } from 'lucide-react';

export default function DoctorDashboard() {
  const queue = [
    { name: "David Oluwaseun", id: "22CH031980", time: "10:20 AM", status: "Waiting" },
    { name: "Sarah Jones", id: "22CH045120", time: "10:40 AM", status: "In-Queue" },
    { name: "Michael Chen", id: "22CH099110", time: "11:00 AM", status: "In-Queue" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* Sidebar - Quick Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <span className="text-xl font-bold">DigiMed Staff</span>
        </div>
        <nav className="space-y-4">
          <div className="text-blue-400 bg-blue-600/10 p-3 rounded-xl font-bold">Patient Queue</div>
          <div className="text-slate-400 p-3 rounded-xl hover:bg-slate-800 transition">Schedule Manager</div>
          <div className="text-slate-400 p-3 rounded-xl hover:bg-slate-800 transition">History Logs</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Doctor's Portal</h1>
            <p className="text-slate-900 font-bold">Welcome back, Dr. Olawale</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wait Time</p>
              <p className="text-xl font-black text-blue-600">12 Mins</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seen Today</p>
              <p className="text-xl font-black text-green-600">14</p>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={18} />
          <input 
            type="text" 
            placeholder="Search student by name or matric number..."
            className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-900 font-bold"
          />
        </div>

        {/* The Live Queue Table */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm flex items-center gap-2">
              <Users size={18} /> Live Appointments
            </h3>
            <span className="text-xs font-bold text-slate-900 bg-white border px-3 py-1 rounded-full">3 Students Waiting</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="p-6 text-xs font-black text-slate-400 uppercase">Student Details</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase">Appt. Time</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase">Status</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((student, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-slate-900">{student.name}</p>
                      <p className="text-xs font-bold text-slate-500">{student.id}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Clock size={16} /> {student.time}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                        student.status === 'Waiting' 
                        ? 'bg-orange-50 text-orange-600 border-orange-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <Link 
                        href="/doctor/consult"
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
        </div>

      </main>
    </div>
  );
}