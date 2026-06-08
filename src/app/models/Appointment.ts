import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  matricNumber: string;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  date: string;
  createdAt: Date; 
  time: string;
  status: "Waiting" | "In-Queue" | "Attended" | "Cancelled";
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
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;