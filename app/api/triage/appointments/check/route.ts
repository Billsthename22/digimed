// app/api/appointments/check/route.ts
import { NextResponse } from "next/server";
import { analyzeSymptoms, TriageLevel } from "@/app/lib/triageService"; 
import { validateStudentAvailability, validateDoctorAvailability } from "@/app/lib/scheduler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, doctorId, symptoms, requestedDate } = body;

    // 1. Basic Validation
    if (!studentId || !doctorId || !requestedDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const date = new Date(requestedDate);
    
    // Check if the date is actually valid
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // 2. Triage First (Prioritize urgency)
    const triage = analyzeSymptoms(symptoms);

    // 3. The "Emergency Bypass"
    // Using the Enum TriageLevel.RED is safer than the string "RED"
    if (triage.level === TriageLevel.RED) {
       return NextResponse.json({ 
         canBook: true, 
         triage, 
         bypass: true,
         message: "EMERGENCY: Immediate clinical bypass granted." 
       });
    }

    // 4. Parallel Check: Student Timetable & Doctor Availability
    // We run these in parallel to minimize API latency
    const [studentCheck, doctorCheck] = await Promise.all([
      validateStudentAvailability(studentId, date),
      validateDoctorAvailability(doctorId, date)
    ]);

    // 5. Handle Conflicts
    if (!studentCheck.isAvailable) {
      return NextResponse.json({ 
        canBook: false, 
        reason: "STUDENT_CLASS_CONFLICT", 
        message: studentCheck.conflictReason || "Conflict with academic timetable."
      }, { status: 409 });
    }

    if (!doctorCheck.isFree) {
      return NextResponse.json({ 
        canBook: false, 
        reason: "DOCTOR_BOOKED", 
        message: doctorCheck.conflict || "The doctor is already booked for this time slot." 
      }, { status: 409 });
    }

    // 6. Final Approval
    return NextResponse.json({ 
      canBook: true, 
      triage,
      message: "Schedule clear: No academic or clinical conflicts found." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Booking Check Error:", error);
    return NextResponse.json({ 
      error: "Internal System Check Failed",
      details: error.message 
    }, { status: 500 });
  }
}