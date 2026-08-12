import crypto from "crypto";
import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// Change this to your actual campus email domain
const ALLOWED_EMAIL_DOMAIN = "@yourcollege.edu";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.enum(["student", "staff", "worker", "faculty"]),
  campusId: z.string().trim().min(1, "Campus ID is required"),
});

// @desc   Register a new user (starts as unverified, pending email + ID check)
// @route  POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.errors[0].message);
  }

  const { name, email, password, designation, campusId } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (!normalizedEmail.endsWith(ALLOWED_EMAIL_DOMAIN)) {
    res.status(400);
    throw new Error(
      `Please register with your official campus email (${ALLOWED_EMAIL_DOMAIN})`
    );
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { campusId }],
  });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email or campus ID already exists");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    designation,
    campusId,
    emailVerificationToken,
  });

  // TODO: send an email to the user containing a link with emailVerificationToken
  // e.g. https://yourapp.com/verify-email/${emailVerificationToken}
  // (use nodemailer or a transactional email service — not wired up yet)

  res.status(201).json({
    message: "Account created. Please check your email to verify your account.",
    userId: user._id,
  });
});

// @desc   Confirm a user's email using the token sent at registration
// @route  GET /api/auth/verify-email/:token
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification link");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  await user.save();

  res.json({
    message: "Email verified. Your account is now pending admin identity verification.",
  });
});

// @desc   Log in and receive a JWT
// @route  POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  const token = generateToken(user._id, user.tokenVersion);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      verificationStatus: user.verificationStatus,
    },
  });
});

// @desc   Get the currently logged-in user's profile
// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc   Upload a photo of the user's college ID card for admin verification
// @route  POST /api/auth/upload-id-proof
// @access Private
const uploadIdProof = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a photo of your college ID card");
  }

  if (req.user.verificationStatus === "verified") {
    res.status(400);
    throw new Error("Your account is already verified");
  }

  const result = await uploadToCloudinary(req.file.buffer, "id-proofs");

  req.user.idProofUrl = result.secure_url;
  req.user.verificationStatus = "pending"; // reset in case this is a resubmission after rejection
  req.user.rejectionReason = null;
  await req.user.save();

  res.json({
    message: "ID proof uploaded. Your account is pending admin verification.",
    idProofUrl: result.secure_url,
  });
});

export { registerUser, verifyEmail, loginUser, getMe, uploadIdProof };
