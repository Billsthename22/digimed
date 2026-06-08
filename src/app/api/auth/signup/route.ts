import { NextRequest } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Student from "@/src/app/models/student";

interface SignupBody {
  fullName: string;
  matricNumber: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { fullName, matricNumber, email, password }: SignupBody = await req.json();

    if (!fullName || !matricNumber || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      $or: [
        { email: email.toLowerCase() },
        { matricNumber: matricNumber.toUpperCase() },
      ],
    });

    if (existingStudent) {
      const field =
        existingStudent.email === email.toLowerCase()
          ? "Email"
          : "Matric number";
      return Response.json(
        { success: false, message: `${field} is already registered` },
        { status: 409 }
      );
    }

    const student = await Student.create({ fullName, matricNumber, email, password });

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          id: student._id,
          fullName: student.fullName,
          matricNumber: student.matricNumber,
          email: student.email,
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
    console.error("Signup error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}