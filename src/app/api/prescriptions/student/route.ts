import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Prescription from "@/src/app/models/Prescription";

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

    // Only return Ready or Collected prescriptions to student
    const prescriptions = await Prescription.find({
      studentId,
      status: { $in: ["Ready", "Collected"] },
    }).sort({ createdAt: -1 });

    return Response.json({ success: true, data: prescriptions }, { status: 200 });
  } catch (error) {
    console.error("Fetch prescriptions error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}