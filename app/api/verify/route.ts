export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
  
    // Verify the appointment exists in Supabase
    const { data, error } = await supabase
      .from('appointments')
      .select('*, student:User(name, matricNumber), doctor:User(name)')
      .eq('id', token) 
      .eq('status', 'COMPLETED')
      .single();
  
    if (!data || error) return Response.json({ valid: false });
  
    return Response.json({ 
      valid: true, 
      student: data.student.name, 
      doctor: data.doctor.name 
    });
  }