import connectDB from "@/src/app/lib/connectDB";
import Prescription from "@/src/app/models/Prescription";

export async function GET() {
  try {
    await connectDB();

    const prescriptions = await Prescription.find({
      status: { $in: ["Pending", "Ready"] },
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