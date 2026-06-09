import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrescription extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  matricNumber: string;
  appointmentId: mongoose.Types.ObjectId;
  medication: string;
  diagnosis: string;
  prescribedBy: string;
  status: "Pending" | "Ready" | "Collected";
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    matricNumber: { type: String, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    medication: { type: String, required: true },
    diagnosis: { type: String, required: true },
    prescribedBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Ready", "Collected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Prescription) {
  delete (mongoose.models as any).Prescription;
}

const Prescription = mongoose.model<IPrescription>("Prescription", prescriptionSchema);

export default Prescription;