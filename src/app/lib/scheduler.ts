// app/lib/scheduler.ts
import { prisma } from "./prisma";

export async function validateSlotAvailability(
  studentId: string, 
  doctorId: string, 
  requestedDate: Date
) {
  // Define a 30-minute window for the appointment
  const slotStart = new Date(requestedDate);
  const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

  // 1. Check for Doctor Conflicts
  const doctorConflict = await prisma.appointment.findFirst({
    where: {
      doctorId: doctorId,
      status: "CONFIRMED",
      OR: [
        {
          startTime: { lte: slotStart },
          endTime: { gt: slotStart },
        },
        {
          startTime: { lt: slotEnd },
          endTime: { gte: slotEnd },
        },
      ],
    },
  });

  if (doctorConflict) {
    return { 
      available: false, 
      message: "This doctor is already booked for this time slot." 
    };
  }

  // 2. Check for Student Conflicts (Existing Appointment)
  const studentConflict = await prisma.appointment.findFirst({
    where: {
      studentId: studentId,
      status: "CONFIRMED",
      startTime: { lte: slotStart },
      endTime: { gte: slotStart },
    },
  });

  if (studentConflict) {
    return { 
      available: false, 
      message: "You already have another appointment during this time." 
    };
  }

  return { available: true };
}