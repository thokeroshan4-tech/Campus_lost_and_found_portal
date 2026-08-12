import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },

    // role drives ACCESS CONTROL only ("user" vs "admin")
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // designation is descriptive only — never used for permission checks
    designation: {
      type: String,
      enum: ["student", "staff", "worker", "faculty"],
      required: true,
    },

    campusId: { type: String, required: true, unique: true, trim: true },

    // Identity verification
    idProofUrl: { type: String, default: null },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },

    // Email confirmation
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },

    // Bumped on password change to invalidate old JWTs
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
