import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return Response.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findOne({
      studentId,
      status: { $in: ["Waiting", "In-Queue"] },
    }).sort({ createdAt: -1 });

    // Get queue position
    let queuePosition = null;
    if (appointment) {
      const ahead = await Appointment.countDocuments({
        doctorId: appointment.doctorId,
        status: { $in: ["Waiting", "In-Queue"] },
        createdAt: { $lt: appointment.createdAt },
      });
      queuePosition = ahead + 1;
    }

    return Response.json(
      { success: true, data: appointment, queuePosition },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch student appointment error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}