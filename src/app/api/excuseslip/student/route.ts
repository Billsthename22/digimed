import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import ExcuseSlip from "@/src/app/models/ExcuseSlip";

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

    const slips = await ExcuseSlip.find({ studentId }).sort({ createdAt: -1 });

    return Response.json({ success: true, data: slips }, { status: 200 });
  } catch (error) {
    console.error("Fetch excuse slip error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch excuse slips" },
      { status: 500 }
    );
  }
}