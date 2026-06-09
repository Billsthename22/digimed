import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return Response.json(
        { success: false, message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const appointments = await Appointment.find({
      doctorId,
      status: "Attended",
    }).sort({ updatedAt: -1 });

    return Response.json({ success: true, data: appointments }, { status: 200 });
  } catch (error) {
    console.error("Fetch doctor appointments error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}