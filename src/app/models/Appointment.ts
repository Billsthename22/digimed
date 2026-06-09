import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  matricNumber: string;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  date: string;
  time: string;
  status: "Waiting" | "In-Queue" | "Attended" | "Cancelled";
  reason: string;
  department: string;
  schoolDepartment: string;
  severity: number;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    matricNumber: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Waiting", "In-Queue", "Attended", "Cancelled"],
      default: "Waiting",
    },
    reason: {
      type: String,
      required: [true, "Reason for visit is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Clinic service is required"],
      trim: true,
    },
    schoolDepartment: {
      type: String,
      required: [true, "School department is required"],
      trim: true,
    },
    severity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Force delete cached model so new schema is used
if (mongoose.models.Appointment) {
  delete mongoose.models.Appointment;
}

const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
export default Appointment;