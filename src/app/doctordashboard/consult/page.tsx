"use client";
import React, { useEffect, useState } from 'react';
import { ClipboardList, Pill, FileCheck, ArrowLeft, Send, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Appointment {
  _id: string;
  studentName: string;
  matricNumber: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  department: string;
  schoolDepartment: string;
  severity: number;
}

export default function DoctorConsultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('id');

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [excuseSlip, setExcuseSlip] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setError('No appointment ID provided.');
      setLoading(false);
      return;
    }
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointment(data.data);
    } catch (err) {
      setError('Failed to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!diagnosis.trim() || !medication.trim()) {
      setSubmitError('Please fill in both diagnosis notes and medication.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis, medication, excuseSlip }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || 'Something went wrong.');
        return;
      }

      setSuccess(true);

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => router.push('/doctordashboard'), 2000);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityInfo = (severity: number) => {
    if (severity <= 3) return { color: 'bg-green-50 text-green-600 border-green-200', label: 'Low' };
    if (severity <= 7) return { color: 'bg-orange-50 text-orange-600 border-orange-200', label: 'Moderate' };
    return { color: 'bg-red-50 text-red-600 border-red-200', label: 'Urgent' };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b-2 border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/doctordashboard" className="text-slate-900 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-black text-slate-900">Patient Consultation</h1>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black border border-green-200">
          LIVE SESSION
        </div>
      </nav>

      <main className="max-w-5xl mx-auto w-full p-6 grid lg:grid-cols-3 gap-8">

        {/* Left Column: Patient Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm overflow-hidden">

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <span className="font-bold text-sm">Loading patient...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400 px-6 text-center">
                <AlertTriangle size={32} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {!loading && appointment && (
              <>
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-black text-2xl border-4 border-white/20 shadow-xl">
                    {appointment.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                    {appointment.studentName}
                  </h2>
                  <p className="text-blue-300 font-bold text-xs tracking-widest mt-1">
                    {appointment.matricNumber}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">

                  <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">School Department</p>
                    <p className="text-slate-900 font-black text-sm">{appointment.schoolDepartment ?? 'Not provided'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Service</p>
                    <p className="text-slate-900 font-black text-sm">{appointment.department}</p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Reason for Visit</p>
                    <p className="text-slate-800 font-bold text-sm leading-relaxed">{appointment.reason}</p>
                  </div>

                  <div className="rounded-2xl p-4 border-2 border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Severity</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${getSeverityInfo(appointment.severity ?? 1).color}`}>
                        {getSeverityInfo(appointment.severity ?? 1).label}
                      </span>
                      <span className="text-sm font-black text-slate-500">{appointment.severity ?? 1}/10</span>
                    </div>
                    <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (appointment.severity ?? 1) <= 3 ? 'bg-green-500' :
                          (appointment.severity ?? 1) <= 7 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${((appointment.severity ?? 1) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 border-2 border-slate-100 space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Appointment Time</p>
                      <p className="text-slate-900 font-bold text-sm">{appointment.time} — {appointment.date}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                        appointment.status === 'Waiting'
                          ? 'bg-orange-50 text-orange-600 border-orange-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attending Doctor</p>
                      <p className="text-slate-900 font-bold text-sm">
                        Dr. {appointment.doctorName?.split(' ').slice(-1)[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Medical Entry */}
        <div className="lg:col-span-2 space-y-6">

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-[2rem] p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-green-800 mb-2">Consultation Complete!</h3>
              <p className="text-green-600 font-bold text-sm">
                Prescription sent to pharmacy. Redirecting to dashboard...
              </p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <div className="bg-white rounded-[2rem] border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-900 p-6 text-white flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-400" />
                <span className="font-bold">Clinical Findings & Prescription</span>
              </div>

              <div className="p-8 space-y-6">

                {/* Submit Error */}
                {submitError && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                    <AlertTriangle size={16} /> {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
                    Diagnosis Notes
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Type clinical observations here..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
                    <span className="flex items-center gap-2">
                      <Pill size={16} className="text-blue-600" /> Medication (Sends to Pharmacy)
                    </span>
                  </label>
                  <textarea
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    placeholder="e.g. Paracetamol 500mg (2x Daily), Vitamin C..."
                    className="w-full p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder:text-slate-400 text-slate-900 font-medium"
                  />
                </div>

                <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 p-2 rounded-lg text-yellow-800">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Issue Medical Excuse Slip</p>
                      <p className="text-xs text-slate-600 font-medium">This will be sent to the student's dashboard.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={excuseSlip}
                    onChange={(e) => setExcuseSlip(e.target.checked)}
                    className="w-6 h-6 rounded accent-blue-600 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleFinalize}
                  disabled={loading || !!error || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
                >
                  {submitting
                    ? <><Loader2 className="animate-spin" size={20} /> Processing...</>
                    : <><Send size={20} /> Finalize & Update Pharmacy</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}