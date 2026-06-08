"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, User, Stethoscope, Paperclip } from 'lucide-react';

export default function ChatPage() {
  const [message, setMessage] = useState("");

  const chatHistory = [
    { sender: 'doctor', text: "Hello David, I see you reported a persistent headache. Have you taken any medication yet?", time: "10:05 AM" },
    { sender: 'student', text: "No, not yet. I wanted to check if I can use the Paracetamol from my last visit.", time: "10:07 AM" },
    { sender: 'doctor', text: "Yes, you can take 2 tablets. If the pain persists for more than 4 hours, please book a physical slot.", time: "10:10 AM" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Chat Header */}
      <nav className="bg-white border-b-2 border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-900 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
              <Stethoscope size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-tight">Clinic Support</h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Online</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        <div className="text-center">
          <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-3 py-1 rounded-full">TODAY</span>
        </div>

        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl border-2 ${
              msg.sender === 'student' 
              ? 'bg-blue-600 border-blue-700 text-white rounded-tr-none shadow-lg shadow-blue-100' 
              : 'bg-white border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
            }`}>
              <p className="font-bold text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[9px] mt-2 font-black uppercase ${msg.sender === 'student' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input - High Visibility */}
      <div className="bg-white border-t-2 border-slate-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 p-2 rounded-[2rem] border-2 border-slate-200 focus-within:border-blue-500 transition-all shadow-inner">
          <button className="p-3 text-slate-900 hover:bg-white rounded-full transition">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            placeholder="TYPE YOUR CONCERN HERE..."
            className="flex-1 bg-transparent p-3 outline-none font-black text-slate-900 placeholder:text-slate-900 placeholder:opacity-50 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition">
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[9px] font-black text-slate-400 mt-3 uppercase tracking-widest">
          End-to-End Encrypted Medical Consultation
        </p>
      </div>
    </div>
  );
}