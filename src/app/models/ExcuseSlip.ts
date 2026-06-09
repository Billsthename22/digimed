import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";

export interface IExcuseSlip extends Document {
  token: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  matricNumber: string;
  appointmentId: mongoose.Types.ObjectId;
  issuedBy: string;
  reason: string;
  department: string;
  schoolDepartment: string;
  dateIssued: string;
  validDays: number;
  expiryDate: string;
  isVerified: boolean;
  createdAt: Date;
}

const excuseSlipSchema = new Schema<IExcuseSlip>(
  {
    token: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    matricNumber: { type: String, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    issuedBy: { type: String, required: true },
    reason: { type: String, required: true },
    department: { type: String, required: true },
    schoolDepartment: { type: String, required: true },
    dateIssued: { type: String, required: true },
    validDays: { type: Number, default: 2 },
    expiryDate: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.ExcuseSlip) delete (mongoose.models as any).ExcuseSlip;

const ExcuseSlip = mongoose.model<IExcuseSlip>("ExcuseSlip", excuseSlipSchema);
export default ExcuseSlip;