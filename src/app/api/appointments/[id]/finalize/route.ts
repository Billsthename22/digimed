import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";
import Prescription from "@/src/app/models/Prescription";
import ExcuseSlip from "@/src/app/models/ExcuseSlip";
import Student from "@/src/app/models/student";
import { sendEmail } from "@/src/app/lib/email";

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

    // Send email notification to student
    const student = await Student.findById(appointment.studentId);
    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: "Your prescription has been sent to the pharmacy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">DigiMed Health Update</h2>
            <p>Hi ${appointment.studentName},</p>
            <p>Dr. ${appointment.doctorName} has finished your consultation and sent your prescription to the campus pharmacy.</p>
            <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Medication:</strong> ${medication}</p>
            </div>
            <p>You'll receive another email once it's ready for pickup.</p>
            ${slip ? `<p>Your medical excuse slip is also available on your dashboard.</p>` : ""}
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">DigiMed University Health System</p>
          </div>
        `,
      });
    }

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