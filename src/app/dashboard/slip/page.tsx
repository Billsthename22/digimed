"use client";
import React from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react'; // This is the engine that makes it work
import { ArrowLeft, ShieldCheck, Printer } from 'lucide-react';

export default function ExcuseSlipPage() {
  // This is the unique ID for David's specific visit
  const slipID = "DM-2026-0319"; 
  
  // This is the link the lecturer's phone will follow when they scan
  const verificationLink = `https://digimed-demo.vercel.app/verify/${slipID}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-900 font-black mb-6">
          <ArrowLeft size={20} /> BACK
        </Link>

        <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-blue-600 p-6 text-white text-center border-b-4 border-slate-900">
            <h1 className="text-xl font-black uppercase">Official Medical Excuse</h1>
          </div>

          <div className="p-8 text-center">
            {/* THIS IS THE WORKING QR CODE */}
            <div className="p-4 border-4 border-slate-900 inline-block rounded-3xl bg-white mb-6">
              <QRCodeSVG 
                value={verificationLink} 
                size={200}
                level={"H"} // High error correction (works even if screen is cracked)
                includeMargin={true}
              />
            </div>

            <div className="text-left space-y-3 mb-6">
              <p className="text-slate-900 font-black text-sm">STUDENT: DAVID OLUWASEUN</p>
              <p className="text-slate-900 font-black text-sm">ID: {slipID}</p>
              <p className="text-slate-900 font-bold text-xs p-3 bg-yellow-100 border-2 border-yellow-400 rounded-xl">
                Notice: Scan to verify authenticity. This slip is valid for 48 hours only.
              </p>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2"
            >
              <Printer size={18} /> PRINT PDF SLIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}