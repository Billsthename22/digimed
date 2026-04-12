"use client";

import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Doctor', text: 'Hello! How can I help you today?', time: '10:00 AM' },
    { id: 2, sender: 'Student', text: 'I have been feeling a bit dizzy since morning.', time: '10:02 AM' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { 
      id: Date.now(), 
      sender: 'Student', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    // Added a forced background color style just in case Tailwind isn't loading
    <div className="flex h-screen bg-slate-100" style={{ backgroundColor: '#f1f5f9' }}>
      
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-lg">
        <div className="p-6 border-b border-slate-100 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            DR
          </div>
          <h2 className="text-xl font-bold text-slate-800">Dr. Sarah Smith</h2>
          <p className="text-sm font-medium text-emerald-500 flex items-center justify-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> Online
          </p>
        </div>
        <div className="p-4 text-slate-600 text-sm">
          <div className="mb-4">
            <span className="block font-bold text-slate-400 uppercase text-[10px] tracking-wider">Specialty</span>
            <p className="text-slate-800 font-medium">General Physician</p>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase text-[10px] tracking-wider">Patient Notes</span>
            <p className="bg-blue-50 p-2 rounded mt-1 text-blue-800">Monitor dizziness and report any nausea.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-blue-900">Digi Med Portal</h1>
            <p className="text-xs text-slate-500 font-medium italic">Secure encrypted consultation</p>
          </div>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
            End Session
          </button>
        </header>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'Student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender === 'Student' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block mt-2 font-medium ${msg.sender === 'Student' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={sendMessage} className="flex gap-3 max-w-5xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 text-slate-900"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;