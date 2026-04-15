"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Users, ArrowRight, Activity, AlertTriangle, 
  Loader2, LogOut, Stethoscope, CheckCircle 
} from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorName, setDoctorName] = useState<string>('Medical Staff');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchLiveQueue = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id, urgency, status, created_at, symptoms, student_id,
        student_profile:profiles!appointments_student_id_fkey (full_name, role)
      `) 
      .eq('doctor_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
  
    if (error) console.error("Queue Sync Error:", error.message);
    else setAppointments(data || []);
  }, [supabase]);

  // NEW: Approve function to clear minor issues instantly
  const handleApproveAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      // Optimistic update: remove from local state immediately
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } else {
      alert("Approval Error: " + error.message);
    }
  };

  const handleStartConsult = async (id: string) => {
    if (!id) return;
    const startTime = new Date().toISOString();
    
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'confirmed',
        appointment_date: startTime
      })
      .eq('id', id);

    if (!error) {
      router.push(`/doctor/consult/${id}`);
    } else {
      alert("Error confirming appointment: " + error.message);
    }
  };

  useEffect(() => {
    let channel: any;
  
    const initializeDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/staff-login');
        return;
      }
  
      // 1. Initial Data Fetch
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
  
      if (profile) setDoctorName(profile.full_name);
      await fetchLiveQueue(user.id);
      setLoading(false);
  
      // 2. The Chain: .channel -> .on -> .subscribe()
      // CRITICAL: .subscribe() must be the final call in the chain
      channel = supabase
        .channel(`doctor-queue-${user.id}`)
        .on(
          'postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'appointments',
            filter: `doctor_id=eq.${user.id}` 
          }, 
          () => {
            console.log("Realtime update: Refreshing queue...");
            fetchLiveQueue(user.id);
          }
        )
        .subscribe(); 
    };
  
    initializeDashboard();
  
    // 3. Cleanup: This is mandatory to prevent the error during development
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, router, fetchLiveQueue]);
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs text-center px-4">
        Syncing Medical Records...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-slate-900 p-6 text-white flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">DigiMed Staff</span>
        </div>
        <nav className="space-y-4 flex-1 text-sm">
          <div className="text-blue-400 bg-blue-600/10 p-4 rounded-xl font-black border-l-4 border-blue-600">Patient Queue</div>
          <div className="text-slate-400 p-4 rounded-xl hover:bg-slate-800 transition font-bold cursor-pointer">Live Chat</div>
        </nav>
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/staff-login'); }} 
          className="mt-auto flex items-center gap-2 text-slate-400 hover:text-white p-3 transition font-bold"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-12">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Stethoscope size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome, {doctorName.split(' ')[0]}
            </h1>
            <p className="text-slate-500 font-bold text-sm">Real-time triage queue for university clinic.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white px-8 py-5 rounded-3xl border-2 border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</p>
              <p className="text-3xl font-black text-blue-600">{appointments.length}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Live Patient Stream
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="p-8">
                      <p className="font-black text-slate-900 text-lg">{apt.student_profile?.full_name || "Unknown"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REG: {apt.student_id.slice(0, 8)}</p>
                    </td>
                    <td className="p-8">
                      <p className="text-sm font-medium text-slate-600 line-clamp-2 max-w-[280px] leading-relaxed italic">
                        "{apt.symptoms}"
                      </p>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 flex w-fit items-center gap-2 ${
                        apt.urgency === 'high' 
                        ? 'bg-red-50 text-red-600 border-red-100 shadow-sm' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {apt.urgency === 'high' && <Activity size={12} className="animate-pulse" />}
                        {apt.urgency}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleApproveAppointment(apt.id)}
                          className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border-2 border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all group/btn shadow-sm"
                          title="Quick Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleStartConsult(apt.id)}
                          className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.03] active:scale-95 transition-all shadow-md flex items-center gap-3"
                        >
                          Attend <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {appointments.length === 0 && (
              <div className="py-32 text-center">
                <div className="bg-slate-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                  <Stethoscope className="text-slate-300" size={36} />
                </div>
                <h4 className="text-slate-900 font-black text-xl mb-1">Queue Clear</h4>
                <p className="text-slate-400 font-bold text-sm">No pending student triage requests.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}