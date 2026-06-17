import React from 'react';
import { Calendar, MessageSquare, CheckCircle, Clock, ShieldCheck, QrCode } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">DigiMed</div>
        <div className="space-x-6 text-slate-900 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login / Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Skip the Clinic Queue, <span className="text-blue-600">Focus on Class.</span>
          </h1>
          <p className="text-lg text-slate-900 max-w-md font-medium">
            The all-in-one medical portal for students. Book appointments, chat with doctors, 
            and get verified digital excuse slips instantly.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
              Book Appointment
            </button>
            <button className="border-2 border-slate-300 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition">
              Virtual Triage
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
          <div className="bg-blue-100 rounded-3xl p-8 aspect-video flex items-center justify-center shadow-inner">
             {/* Visual Placeholder for App Screenshot */}
             <div className="bg-white p-4 rounded-xl shadow-2xl w-3/4 transform -rotate-3 border border-slate-100">
                <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-blue-50 rounded flex items-center px-2 text-xs font-bold text-slate-900">⏱️ Slot Confirmed: 10:30 AM</div>
                  <div className="h-8 w-full bg-green-50 rounded flex items-center px-2 text-xs font-bold text-slate-900">💬 End-to-End Encrypted Chat</div>
                  <div className="h-8 w-full bg-purple-50 rounded flex items-center px-2 text-xs font-bold text-slate-900">📄 Secure Verification Token</div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Feature Grid - Triple Queue Problem Resolved */}
      <section id="features" className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Solve the Triple Queue Problem</h2>
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Structured Scheduling */}
            <div className="space-y-4 p-6 border-2 border-slate-100 rounded-2xl hover:shadow-xl hover:border-blue-100 transition group">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center transition">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Fixed Time Slots</h3>
              <p className="text-black font-normal leading-relaxed">
                Eliminate unpredictable wait times completely. Sync booking windows directly with your student lecture timetable to lock in exact, unmovable consultation periods that work around your class schedule.
              </p>
            </div>

            {/* Messaging */}
            <div className="space-y-4 p-6 border-2 border-slate-100 rounded-2xl hover:shadow-xl hover:border-green-100 transition group">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center transition">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure Messaging</h3>
              <p className="text-black font-normal leading-relaxed">
                Consult with medical professionals remotely via an end-to-end encrypted messaging channel. Safely discuss minor symptoms, share updates, and clear clinical triage without stepping foot in a congested waiting room.
              </p>
            </div>

            {/* Digital Verification */}
            <div className="space-y-4 p-6 border-2 border-slate-100 rounded-2xl hover:shadow-xl hover:border-purple-100 transition group">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center transition">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Verifiable Excuse Slips</h3>
              <p className="text-black font-normal leading-relaxed">
                Receive authoritative digital absence verification immediately following your consultation. Generated slips carry a unique tamper-proof cryptographic signature and scannable tracking hash for administrators to verify instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Stats */}
      <footer className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">© 2026 DigiMed - University Health Management System</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-white font-medium">
            <Clock size={16} className="text-blue-400" />
            <span>Targeting 0% waiting room congestion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;