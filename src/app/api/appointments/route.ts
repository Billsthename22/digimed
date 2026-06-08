import { NextRequest } from "next/server";
import connectDB from "../../lib/connectDB";
import Appointment from "../../models/Appointment";


export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find({
      status: { $in: ["Waiting", "In-Queue"] },
    }).sort({ createdAt: 1 });
    return Response.json({ success: true, data: appointments }, { status: 200 });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { studentId, studentName, matricNumber, doctorId, doctorName, date, time } = await req.json();

    if (!studentId || !studentName || !matricNumber || !doctorId || !doctorName || !date || !time) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if student already has an active appointment
    const existing = await Appointment.findOne({
      studentId,
      status: { $in: ["Waiting", "In-Queue"] },
    });

    if (existing) {
      return Response.json(
        { success: false, message: "You already have an active appointment" },
        { status: 409 }
      );
    }

    // Check if that time slot is already taken for that doctor
    const slotTaken = await Appointment.findOne({ doctorId, date, time, status: { $in: ["Waiting", "In-Queue"] } });
    if (slotTaken) {
      return Response.json(
        { success: false, message: "This time slot is already booked. Please pick another." },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      studentId,
      studentName,
      matricNumber,
      doctorId,
      doctorName,
      date,
      time,
      status: "Waiting",
    });

    return Response.json(
      { success: true, message: "Appointment booked successfully", data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Book appointment error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}