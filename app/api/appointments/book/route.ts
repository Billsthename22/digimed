import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { symptoms, urgency } = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // SMART LOGIC: Get current queue length to assign position
  const { count } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const queuePos = (count || 0) + 1;

  // Insert the appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      student_id: user.id,
      symptoms,
      urgency_level: urgency,
      queue_position: queuePos,
      status: 'pending'
    }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data[0]);
}