import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";
import Prescription from "@/src/app/models/Prescription"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { diagnosis, medication, excuseSlip } = await req.json();

    if (!diagnosis || !medication) {
      return Response.json(
        { success: false, message: "Diagnosis and medication are required" },
        { status: 400 }
      );
    }

    // Get the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return Response.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Create prescription
    const prescription = await Prescription.create({
      studentId: appointment.studentId,
      studentName: appointment.studentName,
      matricNumber: appointment.matricNumber,
      appointmentId: appointment._id,
      medication,
      diagnosis,
      prescribedBy: appointment.doctorName,
      status: "Pending",
    });

    // Mark appointment as Attended
    await Appointment.findByIdAndUpdate(id, { status: "Attended" });

    return Response.json(
      {
        success: true,
        message: "Consultation finalized and sent to pharmacy",
        data: prescription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Finalize error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}