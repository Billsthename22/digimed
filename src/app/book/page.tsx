"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, User, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

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
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
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
    if (!student || !selectedDoctor || !selectedSlot) return;
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
          date: getTodayDate(),
          time: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setStep(2); // send back to time selection if slot taken
        return;
      }

      setStep(3); // success
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">New Appointment</h1>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>Select Doctor</span>
          <ArrowRight size={14} />
          <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>Pick Time</span>
          <ArrowRight size={14} />
          <span className={step === 3 ? "text-blue-600 font-bold" : ""}>Confirm</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto mt-10 px-6">

        {/* Error Banner */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-2xl">
            {error}
          </div>
        )}

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Who would you like to see?</h2>

            {loadingDoctors && (
              <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 className="animate-spin" size={24} />
                <span className="font-bold">Loading doctors...</span>
              </div>
            )}

            {!loadingDoctors && doctors.length === 0 && (
              <div className="text-center py-20 text-slate-400 font-bold">
                No doctors are currently available.
              </div>
            )}

            {!loadingDoctors && doctors.length > 0 && (
              <div className="grid gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => { setSelectedDoctor(doc); setStep(2); setError(''); }}
                    className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-lg">
                        {doc.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{doc.fullName}</h3>
                        <p className="text-slate-500 text-sm">{doc.email}</p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Time Slot */}
        {step === 2 && (
          <div className="space-y-6">
            <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-bold">
              ← Back to Doctors
            </button>
            <h2 className="text-2xl font-bold text-slate-900">
              Select a Time with {selectedDoctor?.fullName}
            </h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-2 mb-6 text-slate-600">
                <Clock size={18} />
                <span className="font-bold">{getTodayDate()}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${selectedSlot === slot
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedSlot || booking}
                className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? <Loader2 className="animate-spin" size={20} /> : <>Confirm Booking <ArrowRight size={20} /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Appointment Secured!</h2>
            <p className="text-slate-600 mb-8 max-w-xs mx-auto">
             
           Your visit with <span className="font-black text-slate-900">Dr. {selectedDoctor?.fullName}</span> is set for <span className="font-black text-slate-900">{selectedSlot}</span>.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-black text-slate-900">{selectedDoctor?.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Time:</span>
                <span className="font-black text-blue-600">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date:</span>
                <span className="font-black text-slate-900">{getTodayDate()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status:</span>
                <span className="font-black text-orange-500">Waiting</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}