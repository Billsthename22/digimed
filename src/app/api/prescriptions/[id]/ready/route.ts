import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Prescription from "@/src/app/models/Prescription";

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