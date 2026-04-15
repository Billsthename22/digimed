"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Calendar, Clock, FileCheck, Pill, MessageCircle, 
  ArrowRight, QrCode, PlusCircle, LogOut, Loader2,
  Stethoscope, ClipboardList, CheckCircle, AlertCircle,
  Zap
} from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Function to fetch the most recent active appointment
  const fetchActiveAppointment = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id, 
        status, 
        appointment_date, 
        urgency, 
        symptoms,
        doctor_profile:profiles!doctor_id (full_name)
      `)
      .eq('student_id', userId)
      .in('status', ['pending', 'approved', 'confirmed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setUpcomingAppointment(data);
    } else {
      setUpcomingAppointment(null);
    }
  }, [supabase]);

  useEffect(() => {
    let channel: any;

    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchActiveAppointment(user.id);
      setLoading(false);

      // FIX: Chaining .channel -> .on -> .subscribe() to prevent runtime errors
      channel = supabase
        .channel(`student-updates-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `student_id=eq.${user.id}`
          },
          (payload) => {
            console.log("Status Update Sync:", payload.new.status);
            setUpcomingAppointment(payload.new);
          }
        )
        .subscribe();
    };

    initialize();

    // CLEANUP: Prevents the "after subscribe" error during development/re-renders
    return () => { 
      if (channel) {
        supabase.removeChannel(channel); 
      }
    };
  }, [router, supabase, fetchActiveAppointment]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const fullName = user?.user_metadata?.full_name || "Student User";
  const matricNo = user?.user_metadata?.matric_number || "NO-MATRIC";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // Helper to determine if we are in an active chat state
  const isLive = upcomingAppointment?.status === 'confirmed';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">DigiMed Portal</h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block text-slate-900">
            <p className="text-sm font-black">{fullName}</p>
            <p className="text-xs font-bold opacity-70">{matricNo}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black shadow-md hover:bg-red-600 transition-all group"
          >
            <span className="group-hover:hidden">{initials}</span>
            <LogOut size={18} className="hidden group-hover:block" />
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        
        {/* HERO SECTION: Conditional Rendering with Status-Specific Colors */}
        {upcomingAppointment ? (
          <section className={`rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-all duration-700 ${
            isLive ? 'bg-emerald-600' : 
            upcomingAppointment.status === 'approved' ? 'bg-blue-600' : 'bg-slate-900'
          }`}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {isLive && '● Live Consultation'}
                    {upcomingAppointment.status === 'approved' && '✓ Request Approved'}
                    {upcomingAppointment.status === 'pending' && 'Triage Pending'}
                  </span>
                  <h2 className="text-4xl font-black mt-4 tracking-tight">
                    {isLive && 'Doctor is attending to you'}
                    {upcomingAppointment.status === 'approved' && 'Your request is approved'}
                    {upcomingAppointment.status === 'pending' && 'Waiting for triage...'}
                  </h2>
                  <p className="mt-3 text-white/90 font-bold text-sm max-w-lg leading-relaxed">
                    {upcomingAppointment.status === 'approved' 
                      ? "Your clinical request has been verified. Please proceed to the clinic reception for further processing." 
                      : upcomingAppointment.symptoms}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-8">
                {isLive && (
                  <Link 
                    href={`/consult/${upcomingAppointment.id}`}
                    className="flex items-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <MessageCircle size={18} /> Join Live Session
                  </Link>
                )}
                <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                  <Stethoscope size={18} className="text-white/70" />
                  <span className="font-black text-xs uppercase tracking-wider">
                    {upcomingAppointment.doctor_profile?.full_name || "Medical Officer Assigned"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Visual HUD accent */}
            <div className="absolute -right-16 -bottom-16 opacity-10">
               <Activity size={300} strokeWidth={1} />
            </div>
          </section>
        ) : (
          <section className="bg-white border-2 border-dashed border-slate-300 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="max-w-md mx-auto py-4">
              <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600">
                <Stethoscope size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No Active Orders</h2>
              <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed">
                Welcome, {fullName.split(' ')[0]}. You don't have any active appointments or triage requests at this time.
              </p>
              <Link href="/book" className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group">
                Request Appointment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT COLUMN: DYNAMIC HUB/CHAT CARD */}
          <div className="md:col-span-1 space-y-6">
            <div className={`rounded-[2rem] border-2 p-8 shadow-sm transition-all duration-500 ${
              isLive 
                ? 'bg-emerald-50 border-emerald-200 border-t-8 border-t-emerald-500' 
                : 'bg-white border-slate-200 border-t-8 border-t-blue-600'
            }`}>
              <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-3 uppercase tracking-tighter">
                {isLive ? (
                  <><Zap size={22} className="text-emerald-500 animate-pulse" /> Live Session</>
                ) : (
                  <><PlusCircle size={22} className="text-blue-600" /> Clinical Hub</>
                )}
              </h3>
              <p className="text-xs font-bold text-slate-500 mb-8 leading-relaxed">
                {isLive 
                  ? "Your consultation is currently active. Click below to enter the secure messaging room." 
                  : "Access rapid check-ins and verified medical excuses using your digital portal credentials."}
              </p>
              
              {isLive ? (
                <Link 
                  href={`/consult/${upcomingAppointment.id}`} 
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  ENTER CHAT ROOM <MessageCircle size={16} />
                </Link>
              ) : (
                <Link 
                  href="/book" 
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
                >
                  NEW TRIAGE REQUEST <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Medical Records History */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
               Verified History
            </h3>
            <div className="bg-white rounded-[2rem] border-2 border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="bg-slate-50 p-8 rounded-3xl mb-6 text-slate-300">
                <ClipboardList size={56} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Vault is Empty</h4>
              <p className="text-sm font-bold text-slate-500 max-w-xs leading-relaxed opacity-60">
                Authorized medical slips and digital prescriptions will be archived here following your session.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Background HUD Accent SVG
function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}