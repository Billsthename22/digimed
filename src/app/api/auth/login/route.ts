import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Student from "@/src/app/models/student";
import { signToken } from "@/src/app/lib/jwt";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password }: LoginBody = await req.json();

    // --- Basic presence check ---
    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // --- Validate email domain ---
    if (!email.endsWith("@edu.ng")) {
      return Response.json(
        { success: false, message: "Email must be a valid university email address" },
        { status: 400 }
      );
    }

    // --- Find student (include password since it's select: false) ---
    const student = await Student.findOne({ email: email.toLowerCase() }).select("+password");

    if (!student) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Compare password ---
    const isMatch = await student.comparePassword(password);

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Generate JWT token ---
    const token = signToken({
      id: student._id.toString(),
      email: student.email,
      matricNumber: student.matricNumber,
    });

    return Response.json(
      {
        success: true,
        message: "Login successful",
        token,
        data: {
          id: student._id,
          fullName: student.fullName,
          matricNumber: student.matricNumber,
          email: student.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}