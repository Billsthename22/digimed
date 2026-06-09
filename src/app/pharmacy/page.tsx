"use client";
import React, { useEffect, useState } from 'react';
import { Pill, Search, Clock, User, PackageCheck, AlertCircle, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Prescription {
  _id: string;
  studentName: string;
  matricNumber: string;
  medication: string;
  diagnosis: string;
  prescribedBy: string;
  status: "Pending" | "Ready" | "Collected";
  createdAt: string;
}

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filtered, setFiltered] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/prescriptions');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPrescriptions(data.data);
      setFiltered(data.data);
    } catch {
      setError('Failed to load prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFiltered(
      prescriptions.filter(
        (p) =>
          p.studentName.toLowerCase().includes(query) ||
          p.matricNumber.toLowerCase().includes(query)
      )
    );
  };

  const handleMarkReady = async (id: string) => {
    setMarkingId(id);
    try {
      const res = await fetch(`/api/prescriptions/${id}/ready`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update status locally
      const updated = prescriptions.map((p) =>
        p._id === id ? { ...p, status: 'Ready' as const } : p
      );
      setPrescriptions(updated);
      setFiltered(
        updated.filter(
          (p) =>
            p.studentName.toLowerCase().includes(search) ||
            p.matricNumber.toLowerCase().includes(search)
        )
      );
    } catch {
      alert('Failed to mark as ready. Please try again.');
    } finally {
      setMarkingId(null);
    }
  };

  const pendingCount = prescriptions.filter((p) => p.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-slate-900 p-8 text-white flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900">
            <Pill size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">DigiMed RX</span>
        </div>

        <nav className="space-y-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl font-black flex justify-between items-center shadow-lg">
            Incoming Orders
            <span className="bg-white text-blue-600 px-2 py-1 rounded-lg text-xs font-black">
              {pendingCount}
            </span>
          </div>
          <div className="text-slate-400 p-4 rounded-2xl font-bold hover:bg-slate-800 transition cursor-pointer">
            Inventory Tracking
          </div>
          <div className="text-slate-400 p-4 rounded-2xl font-bold hover:bg-slate-800 transition cursor-pointer">
            Pickup History
          </div>
        </nav>

        <div className="mt-auto pt-20">
          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">System Status</p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Connected to Doctor Portal
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Pharmacy Queue</h1>
            <p className="text-slate-500 font-bold">
              {pendingCount} pending · {prescriptions.filter(p => p.status === 'Ready').length} ready for pickup
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search student or matric..."
                className="w-full pl-12 pr-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400 font-bold text-slate-900 text-sm"
              />
            </div>
            <button
              onClick={fetchPrescriptions}
              className="bg-white border-2 border-slate-200 p-4 rounded-2xl hover:border-blue-500 transition"
            >
              <RefreshCw size={20} className={`text-slate-400 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <span className="font-black text-slate-400 uppercase text-xs tracking-widest">Loading prescriptions...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 text-slate-400 font-black uppercase tracking-widest text-xs">
            No prescriptions in the queue.
          </div>
        )}

        {/* Prescription Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6">
            {filtered.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-[2.5rem] border-4 p-8 shadow-md flex flex-col md:flex-row justify-between items-center transition-all gap-6 ${
                  order.status === 'Pending'
                    ? 'border-blue-500 bg-blue-50/20'
                    : 'border-green-200 bg-green-50/20'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-6 w-full md:w-1/3">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-4 font-black text-xl ${
                    order.status === 'Pending'
                      ? 'bg-blue-600 text-white border-blue-100'
                      : 'bg-green-500 text-white border-green-100'
                  }`}>
                    {order.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{order.studentName}</h3>
                    <p className="text-slate-500 font-black text-sm">{order.matricNumber}</p>
                    <p className="text-blue-600 font-black text-xs uppercase mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                      {' '}· Dr. {order.prescribedBy?.split(' ').slice(-1)[0]}
                    </p>
                  </div>
                </div>

                {/* Medication */}
                <div className="w-full md:w-1/3 py-6 md:py-0 md:px-10 border-y-2 md:border-y-0 md:border-x-2 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Prescribed Items
                  </p>
                  <p className="text-slate-900 font-black text-lg leading-tight">{order.medication}</p>
                  <p className="text-slate-400 font-bold text-xs mt-2 leading-relaxed">{order.diagnosis}</p>
                </div>

                {/* Actions */}
                <div className="w-full md:w-1/4 flex flex-col gap-3">
                  {order.status === 'Pending' ? (
                    <button
                      onClick={() => handleMarkReady(order._id)}
                      disabled={markingId === order._id}
                      className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      {markingId === order._id
                        ? <Loader2 className="animate-spin" size={18} />
                        : <><PackageCheck size={20} /> Mark Ready</>
                      }
                    </button>
                  ) : (
                    <div className="w-full bg-green-50 border-2 border-green-200 text-green-700 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} /> Ready for Pickup
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-6 border-4 border-blue-600 shadow-2xl">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shrink-0">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="font-black text-xl">Automatic Student Notification</h4>
            <p className="text-slate-300 font-medium">
              When you mark a prescription as ready, it instantly updates on the student's dashboard as "Ready for Pickup".
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}