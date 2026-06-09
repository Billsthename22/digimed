import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";
import Prescription from "@/src/app/models/Prescription";
import ExcuseSlip from "@/src/app/models/ExcuseSlip";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { diagnosis, medication, excuseSlip, validDays = 2 } = await req.json();

    if (!diagnosis || !medication) {
      return Response.json(
        { success: false, message: "Diagnosis and medication are required" },
        { status: 400 }
      );
    }

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

    // Create excuse slip if checked
    let slip = null;
    if (excuseSlip) {
      const today = new Date();
      const expiry = new Date(today);
      expiry.setDate(expiry.getDate() + validDays);

      const formatDate = (d: Date) =>
        d.toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        });

      slip = await ExcuseSlip.create({
        studentId: appointment.studentId,
        studentName: appointment.studentName,
        matricNumber: appointment.matricNumber,
        appointmentId: appointment._id,
        issuedBy: appointment.doctorName,
        reason: appointment.reason,
        department: appointment.department,
        schoolDepartment: appointment.schoolDepartment,
        dateIssued: formatDate(today),
        validDays,
        expiryDate: formatDate(expiry),
      });
    }

    // Mark appointment as Attended
    await Appointment.findByIdAndUpdate(id, { status: "Attended" });

    return Response.json(
      {
        success: true,
        message: "Consultation finalized successfully",
        data: { prescription, slip },
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