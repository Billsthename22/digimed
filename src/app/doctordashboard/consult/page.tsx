"use client";
import React from 'react';
import { User, ClipboardList, Pill, FileCheck, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function DoctorConsultPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <nav className="bg-white border-b-2 border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/doctor/dashboard" className="text-slate-900 hover:text-blue-600">
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
          <div className="bg-white rounded-[2rem] border-2 border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-900 border-2 border-slate-200">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">David Oluwaseun</h2>
              <p className="text-slate-900 font-bold">22CH031980</p>
            </div>
            
            <div className="space-y-4 border-t-2 border-slate-100 pt-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason for Visit</p>
                <p className="text-slate-900 font-medium">Severe Migraine & Fever symptoms for 2 days.</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</p>
                <p className="text-slate-900 font-medium">Chemical Engineering</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medical Entry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-900 p-6 text-white flex items-center gap-2">
              <ClipboardList size={20} className="text-blue-400" />
              <span className="font-bold">Clinical Findings & Prescription</span>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Diagnosis Input */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Diagnosis Notes</label>
                <textarea 
                  placeholder="Type clinical observations here..."
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder:text-slate-900 font-medium"
                />
              </div>

              {/* Prescription Input */}
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <Pill size={16} className="text-blue-600" /> Medication (Sends to Pharmacy)
                </label>
                <textarea 
                  placeholder="e.g. Paracetamol 500mg (2x Daily), Vitamin C..."
                  className="w-full p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder:text-slate-900 font-medium"
                />
              </div>

              {/* Excuse Slip Toggle */}
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
                <input type="checkbox" className="w-6 h-6 rounded accent-blue-600 cursor-pointer" defaultChecked />
              </div>

              {/* Submit Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3">
                Finalize & Update Pharmacy <Send size={20} />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}