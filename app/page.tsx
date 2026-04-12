import React from 'react';
import { Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">DigiMed</div>
        <div className="space-x-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
          <Link 
            href="/login" 
   className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
         Login / Sign Up
          </Link>
       
    
        

        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Skip the Clinic Queue, <span className="text-blue-600">Focus on Class.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            The all-in-one medical portal for students. Book appointments, chat with doctors, 
            and get verified digital excuse slips instantly.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700">
              Book Appointment
            </button>
            <button className="border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-100">
              Virtual Triage
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
          <div className="bg-blue-100 rounded-3xl p-8 aspect-video flex items-center justify-center shadow-inner">
             {/* Visual Placeholder for App Screenshot */}
             <div className="bg-white p-4 rounded-xl shadow-2xl w-3/4 transform -rotate-3">
                <div className="h-4 w-20 bg-slate-100 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-blue-50 rounded"></div>
                  <div className="h-8 w-full bg-blue-50 rounded"></div>
                  <div className="h-8 w-full bg-blue-50 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Feature Grid - Addresses "Statement of the Problem" [cite: 39-48] */}
      <section id="features" className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Solve the Triple Queue Problem</h2>
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Structured Scheduling [cite: 114] */}
            <div className="space-y-4 p-6 border border-slate-100 rounded-2xl hover:shadow-xl transition">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold">Fixed Time Slots</h3>
              <p className="text-slate-600">Eliminate unpredictable wait times with structured scheduling that respects your lecture timetable.</p>
            </div>

            {/* Messaging [cite: 132] */}
            <div className="space-y-4 p-6 border border-slate-100 rounded-2xl hover:shadow-xl transition">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold">Secure Messaging</h3>
              <p className="text-slate-600">Consult with medical professionals remotely for minor concerns, reducing clinic overcrowding.</p>
            </div>

            {/* Digital Verification [cite: 137] */}
            <div className="space-y-4 p-6 border border-slate-100 rounded-2xl hover:shadow-xl transition">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold">Verifiable Excuse Slips</h3>
              <p className="text-slate-600">Receive a unique, scannable barcode to instantly prove your visit to lecturers and administrators.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Stats [cite: 141, 149] */}
      <footer className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-80">
          <p>© 2025 DigiMed - University Health Management System</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Clock size={16} />
            <span>Targeting 0% waiting room congestion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;