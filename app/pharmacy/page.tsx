"use client";
import React from 'react';
import { Pill, Search, CheckCircle2, Clock, User, ArrowRight, PackageCheck, AlertCircle } from 'lucide-react';

export default function PharmacyDashboard() {
  const prescriptions = [
    { id: "RX-9921", student: "David Oluwaseun", matric: "22CH031980", meds: "Amoxicillin, Paracetamol", time: "10:25 AM", status: "New" },
    { id: "RX-9918", student: "Sarah Jones", matric: "22CH045120", meds: "Ibuprofen, Vitamin C", time: "10:10 AM", status: "Processing" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar - Focus on Fulfillment */}
      <aside className="w-full lg:w-72 bg-slate-900 p-8 text-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900">
            <Pill size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">DigiMed RX</span>
        </div>
        
        <nav className="space-y-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl font-black flex justify-between items-center shadow-lg">
            Incoming Orders <span className="bg-white text-blue-600 px-2 py-1 rounded-lg text-xs">2</span>
          </div>
          <div className="text-slate-400 p-4 rounded-2xl font-bold hover:bg-slate-800 transition cursor-pointer">Inventory Tracking</div>
          <div className="text-slate-400 p-4 rounded-2xl font-bold hover:bg-slate-800 transition cursor-pointer">Pickup History</div>
        </nav>

        <div className="mt-auto pt-20">
          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">System Status</p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Connected to Doctor Portal
            </div>
          </div>
        </div>
      </aside>

      {/* Main Order Queue */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Pharmacy Queue</h1>
            <p className="text-slate-900 font-bold text-lg">Objective C: Automated Prescription Fulfillment</p>
          </div>
          
          <div className="relative w-full md:w-96 shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={20} />
            <input 
              type="text" 
              placeholder="SEARCH STUDENT ID..."
              className="w-full pl-12 pr-5 py-4 bg-white border-4 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500 outline-none placeholder:text-slate-900 placeholder:font-black font-black uppercase text-sm transition-all"
            />
          </div>
        </header>

        {/* Order Cards */}
        <div className="grid gap-6">
          {prescriptions.map((order) => (
            <div key={order.id} className={`bg-white rounded-[2.5rem] border-4 p-8 shadow-md flex flex-col md:flex-row justify-between items-center transition-all ${order.status === 'New' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200'}`}>
              
              <div className="flex items-center gap-6 w-full md:w-1/3">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-4 ${order.status === 'New' ? 'bg-blue-600 text-white border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{order.student}</h3>
                  <p className="text-slate-900 font-black text-sm">{order.matric}</p>
                  <p className="text-blue-600 font-black text-xs uppercase mt-1 flex items-center gap-1">
                    <Clock size={12} /> Received {order.time}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/3 py-6 md:py-0 md:px-10 border-y-2 md:border-y-0 md:border-x-2 border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prescribed Items</p>
                <p className="text-slate-900 font-black text-lg leading-tight">{order.meds}</p>
              </div>

              <div className="w-full md:w-1/4 flex flex-col gap-3 pt-6 md:pt-0">
                <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <PackageCheck size={20} /> Mark Ready
                </button>
                <button className="w-full bg-white border-2 border-slate-200 text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50">
                  Notify Student
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Informational Objective Box */}
        <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-6 border-4 border-blue-600 shadow-2xl">
          <div className="bg-blue-600 p-4 rounded-2xl text-white">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="font-black text-xl">Queue Elimination Feature</h4>
            <p className="text-slate-300 font-medium">This module automatically triggers a "Ready for Pickup" notification on David's dashboard once medication is marked ready.</p>
          </div>
        </div>
      </main>
    </div>
  );
}