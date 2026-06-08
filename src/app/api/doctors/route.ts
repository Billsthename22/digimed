import connectDB from "../../lib/connectDB";
import Doctor from "../../models/Doctor";

export async function GET() {
  try {
    await connectDB();
    const doctors = await Doctor.find({}).select("fullName email");
    return Response.json({ success: true, data: doctors }, { status: 200 });
  } catch (error) {
    console.error("Fetch doctors error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}