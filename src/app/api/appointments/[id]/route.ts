import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Appointment from "@/src/app/models/Appointment";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return Response.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: appointment }, { status: 200 });
  } catch (error) {
    console.error("Fetch appointment error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}