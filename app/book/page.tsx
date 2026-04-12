"use client";
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const doctors = [
  { id: 1, name: "Dr. Olawale", specialty: "General Practitioner", available: "9:00 AM - 12:00 PM" },
  { id: 2, name: "Dr. Adeyemi", specialty: "General Practitioner", available: "1:00 PM - 4:00 PM" },
  { id: 3, name: "Dr. Smith", specialty: "Dentist", available: "10:00 AM - 2:00 PM" },
];

const timeSlots = ["09:00 AM", "09:20 AM", "09:40 AM", "10:00 AM", "10:20 AM", "10:40 AM"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<null | { id: number; name: string; specialty: string; available: string }>(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Mini Header */}
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
        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Who would you like to see?</h2>
            <div className="grid gap-4">
              {doctors.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{doc.name}</h3>
                      <p className="text-slate-500 text-sm">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Availability</p>
                    <p className="text-sm text-slate-700">{doc.available}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Slot Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-medium">← Back to Doctors</button>
            <h2 className="text-2xl font-bold text-slate-900">Select a Time Slot</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-2 mb-6 text-slate-600">
                <CalendarIcon size={18} />
                <span className="font-medium">Tuesday, November 18, 2025</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedSlot(slot); setStep(3); }}
                    className={`py-3 rounded-xl border font-medium transition-all ${
                      selectedSlot === slot 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success State */}
        {step === 3 && (
          <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Appointment Secured!</h2>
            <p className="text-slate-600 mb-8 max-w-xs mx-auto">
              Your visit with **{selectedDoctor?.name}** is set for **{selectedSlot}**.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Queue Position:</span> <span className="font-bold text-blue-600">#1 (Direct Entry)</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Location:</span> <span className="font-bold">University Clinic Wing A</span></div>
            </div>
            <button 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}