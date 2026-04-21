import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Doctor from "@/src/app/models/Doctor";
import { signToken } from "@/src/app/lib/jwt";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password }: LoginBody = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() }).select("+password");

    if (!doctor) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: doctor._id.toString(),
      fullName: doctor.fullName,
      email: doctor.email,
      matricNumber: doctor.role, // reusing matricNumber slot to carry role
    });

    return Response.json(
      {
        success: true,
        message: "Login successful",
        token,
        data: {
          id: doctor._id,
          fullName: doctor.fullName,
          email: doctor.email,
          role: doctor.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Staff login error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}