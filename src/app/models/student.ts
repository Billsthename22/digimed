import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStudent extends Document {
  fullName: string;
  matricNumber: string;
  email: string;
  password: string;
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    matricNumber: {
      type: String,
      required: [true, "Matric number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^\d{2}[A-Z]{2}\d{6}$/,
        "Invalid matric number format (e.g. 22CH031980)",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          const domain = process.env.UNIVERSITY_EMAIL_DOMAIN;
          if (!domain) return true;
          return email.endsWith(`@${domain}`);
        },
        message: "Email must be a valid university email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);

export default Student;