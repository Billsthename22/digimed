import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Doctor from "@/src/app/models/Doctor";

interface SignupBody {
  fullName: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { fullName, email, password }: SignupBody = await req.json();

    if (!fullName || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await Doctor.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    const doctor = await Doctor.create({ fullName, email, password });

    return Response.json(
      {
        success: true,
        message: "Doctor account created successfully",
        data: {
          id: doctor._id,
          fullName: doctor.fullName,
          email: doctor.email,
          role: doctor.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0] as any;
      return Response.json(
        { success: false, message: message.message },
        { status: 400 }
      );
    }
    console.error("Staff signup error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}