"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Stethoscope, AlertCircle, ArrowLeft, Loader2, CheckCircle2, User, Clock 
} from 'lucide-react';
import Link from 'next/link';

export default function BookAppointment() {
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    symptoms: '',
    urgency: 'low',
    doctorId: '',
    preferredTime: '',
  });

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getDoctors = async () => {
      setFetchingDoctors(true);
      try {
        const { data, error } = await supabase
          .from('profiles') 
          .select('id, full_name, role')
          .ilike('role', 'doctor'); 

        if (!error && data) {
          setDoctors(data);
        } else if (error) {
          console.error("Supabase Error:", error.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setFetchingDoctors(false);
      }
    };
    getDoctors();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) return alert("Please select a doctor");
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // Calculate queue
      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', formData.doctorId)
        .eq('status', 'pending');

      const nextQueuePosition = (count || 0) + 1;
      
      let finalScheduledTime: string;
      if (formData.preferredTime) {
        const [hours, minutes] = formData.preferredTime.split(':');
        const selectedDate = new Date();
        selectedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        finalScheduledTime = selectedDate.toISOString();
      } else {
        const estWaitMinutes = (count || 0) * 15;
        const autoDate = new Date();
        autoDate.setMinutes(autoDate.getMinutes() + estWaitMinutes);
        finalScheduledTime = autoDate.toISOString();
      }

      // FIX: Changed 'scheduled_for' to 'appointment_date' to satisfy the DB constraint
      const { error } = await supabase.from('appointments').insert([{
        student_id: user.id,
        doctor_id: formData.doctorId,
        symptoms: formData.symptoms,
        urgency: formData.urgency,
        queue_position: nextQueuePosition,
        appointment_date: finalScheduledTime, 
        status: 'pending'
      }]);

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 2000);
      
    } catch (err: any) {
      console.error("Booking Logic Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-slate-100 max-w-md">
        <CheckCircle2 size={48} className="text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-slate-900 mb-2">Request Sent!</h1>
        <p className="text-slate-500 font-bold">Waiting for the doctor to confirm your slot.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 mb-8 transition">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10">Book Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm">
            <label className="block text-slate-900 font-black text-lg mb-4">Available Doctors</label>
            {fetchingDoctors ? (
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <Loader2 className="animate-spin text-blue-600" size={20} />
                <span>Finding doctors...</span>
              </div>
            ) : doctors.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No doctors found in system</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setFormData({...formData, doctorId: doc.id})}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      formData.doctorId === doc.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-900">{doc.full_name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{doc.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Time */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm">
            <label className="block text-slate-900 font-black text-lg mb-4 flex items-center gap-2">
              <Clock className="text-purple-600" size={20} /> Preferred Time
            </label>
            <input 
              type="time"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 transition font-bold text-slate-900"
              value={formData.preferredTime}
              onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
            />
          </div>

          {/* Symptoms */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm">
            <label className="block text-slate-900 font-black text-lg mb-4 flex items-center gap-2">
              <Stethoscope className="text-blue-600" size={20} /> Symptoms
            </label>
            <textarea 
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 min-h-[120px] outline-none focus:border-blue-500 transition font-medium"
              placeholder="Briefly describe what's wrong..."
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            />
          </div>

          {/* Urgency */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm">
            <label className="block text-slate-900 font-black text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} /> Urgency
            </label>
            <div className="flex gap-4">
              {['low', 'medium', 'high'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({...formData, urgency: lvl})}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs border-2 transition-all ${
                    formData.urgency === lvl ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !formData.doctorId}
            className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}