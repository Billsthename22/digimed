// app/api/appointments/book/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  const { studentId, doctorId, startTime } = await req.json();
  
  // Define 30-min slot
  const start = new Date(startTime);
  const end = new Date(start.getTime() + 30 * 60000);

  // 1. Check if Doctor is busy
  const { data: conflict } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctorId', doctorId)
    .eq('status', 'CONFIRMED')
    .or(`startTime.lte.${start.toISOString()},endTime.gt.${start.toISOString()}`)
    .single();

  if (conflict) {
    return Response.json({ error: "Doctor is already booked." }, { status: 409 });
  }

  // 2. Insert Appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert([{ 
      studentId, 
      doctorId, 
      startTime: start.toISOString(), 
      endTime: end.toISOString(),
      status: 'CONFIRMED' 
    }]);

  return Response.json(data);
}