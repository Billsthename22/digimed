"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, User, ArrowRight, CheckCircle2, Loader2, Stethoscope, AlertTriangle } from 'lucide-react';

interface Doctor {
  _id: string;
  fullName: string;
  email: string;
}

interface StudentInfo {
  id: string;
  fullName: string;
  matricNumber: string;
}

const timeSlots = [
  "09:00 AM", "09:20 AM", "09:40 AM",
  "10:00 AM", "10:20 AM", "10:40 AM",
  "11:00 AM", "11:20 AM", "11:40 AM",
  "12:00 PM", "12:20 PM", "12:40 PM",
];

const departments = [
  "General Consultation",
  "Cardiology",
  "Dental Clinic",
  "Optometry",
  "Mental Health / Counseling",
  "Laboratory Services"
];

function decodeToken(token: string): StudentInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      fullName: payload.fullName,
      matricNumber: payload.matricNumber,
    };
  } catch {
    return null;
  }
}

function getTodayDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function BookingPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [step, setStep] = useState(1);
  
  // New Form States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState(1);

  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const info = decodeToken(token);
    if (!info) { window.location.href = '/login'; return; }
    setStudent(info);
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDoctors(data.data);
    } catch {
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleConfirm = async () => {
    if (!student || !selectedDoctor || !selectedSlot || !department || !reason) {
      setError("Please fill in all details including department and reason.");
      return;
    }
    setBooking(true);
    setError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.fullName,
          matricNumber: student.matricNumber,
          doctorId: selectedDoctor._id,
          doctorName: selectedDoctor.fullName,
          department,
          reason,
          severity,
          date: getTodayDate(),
          time: selectedSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setStep(2); 
        return;
      }
      setStep(3); 
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const getSeverityColor = () => {
    if (severity <= 3) return "bg-green-500";
    if (severity <= 7) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-slate-800 uppercase italic">New Appointment</h1>
        <div className="hidden md:flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className={step >= 1 ? "text-blue-600" : ""}>01. Specialist</span>
          <ArrowRight size={12} />
          <span className={step >= 2 ? "text-blue-600" : ""}>02. Details & Time</span>
          <ArrowRight size={12} />
          <span className={step === 3 ? "text-blue-600" : ""}>03. Confirmed</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto mt-10 px-6">
        {error && (
          <div className="mb-6 px-6 py-4 bg-red-50 border-2 border-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-[#0F1E3D] uppercase italic tracking-tighter">Choose a Specialist</h2>
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 className="animate-spin" size={24} />
                <span className="font-black uppercase text-[10px] tracking-widest">Loading...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => { setSelectedDoctor(doc); setStep(2); setError(''); }}
                    className="group bg-white p-6 rounded-[2rem] border-2 border-slate-100 hover:border-blue-600 hover:shadow-xl cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {doc.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-[#0F1E3D] uppercase italic leading-none mb-1">Dr. {doc.fullName}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{doc.email}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details & Time Slot */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#0F1E3D] text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
              <ArrowRight size={14} className="rotate-180" /> Change Doctor
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason for Visit</label>
                    <textarea 
                      placeholder="Briefly describe your symptoms..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        Severity Level: <span className={`px-2 py-0.5 rounded text-white ${getSeverityColor()}`}>{severity}</span>
                      </label>
                    </div>
                    <input 
                      type="range" min="1" max="10" 
                      value={severity}
                      onChange={(e) => setSeverity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                      <span>Low (Regular)</span>
                      <span>High (Urgent)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Section */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-black text-[#0F1E3D] uppercase tracking-widest">Select Slot</h3>
                   <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                    <Clock size={12} /> {getTodayDate()}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-4 rounded-2xl border-2 text-[11px] font-black transition-all ${selectedSlot === slot
                          ? "bg-[#0F1E3D] border-[#0F1E3D] text-white shadow-xl shadow-blue-900/20"
                          : "bg-white border-slate-100 text-slate-600 hover:border-blue-300"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot || !department || !reason || booking}
                  className="mt-8 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {booking ? <Loader2 className="animate-spin" size={18} /> : <>Confirm Visit <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="text-center bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-[#0F1E3D] uppercase italic tracking-tighter leading-none mb-4">Visit Secured</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">
              Please present your digital ID at the reception.
            </p>
            
            <div className="bg-[#0F1E3D] text-white p-8 rounded-[2.5rem] mb-10 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Specialist</span>
                <span className="font-black italic uppercase">Dr. {selectedDoctor?.fullName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Schedule</span>
                <span className="font-black text-blue-400">{selectedSlot} — Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Dept.</span>
                <span className="font-black text-xs uppercase">{department}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all shadow-xl"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}