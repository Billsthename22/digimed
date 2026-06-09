import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import ExcuseSlip from "@/src/app/models/ExcuseSlip";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectDB();

    const { token } = await params;

    const slip = await ExcuseSlip.findOne({ token });

    if (!slip) {
      return Response.json(
        { success: false, message: "Invalid or tampered slip. This record does not exist." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: slip }, { status: 200 });
  } catch (error) {
    console.error("Verify slip error:", error);
    return Response.json(
      { success: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}