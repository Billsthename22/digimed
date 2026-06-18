import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Prescription from "@/src/app/models/Prescription";
import Student from "@/src/app/models/student";
import { sendEmail } from "@/src/app/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { status: "Ready" },
      { new: true }
    );

    if (!prescription) {
      return Response.json(
        { success: false, message: "Prescription not found" },
        { status: 404 }
      );
    }

    // Send email notification to student
    const student = await Student.findById(prescription.studentId);
    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: "Your medication is ready for pickup",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Your medication is ready! 💊</h2>
            <p>Hi ${prescription.studentName},</p>
            <p>Good news — your prescribed medication is now ready for pickup at the campus pharmacy.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Medication:</strong> ${prescription.medication}</p>
            </div>
            <p>Please bring your student ID when collecting.</p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">DigiMed University Health System</p>
          </div>
        `,
      });
    }

    return Response.json(
      { success: true, message: "Prescription marked as ready", data: prescription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark ready error:", error);
    return Response.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}