import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ──────────────────────────────────────────────────────────────
//  User Model
//
//  FIELDS:
//    • name            (required)  — User's display name
//    • email           (required)  — Unique, lowercased, used for login
//    • password        (required)  — Hashed with bcrypt, excluded from queries by default
//    • image           (optional)  — Cloudinary URL for profile picture
//    • favouriteFlower (optional)  — User's favourite flower
//    • role            (default: "user") — "user" or "admin"
//
//  METHODS:
//    • isPasswordCorrect(password) — Compare plaintext with hashed password
//    • generateAccessToken()       — Create a JWT containing the user's _id, email, and role
//
//  HOOKS:
//    • pre("save") — Automatically hash password when it's new or modified
// ──────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  favouriteFlower?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      select: false, // Exclude from queries by default
    },
    image: {
      type: String, // Cloudinary URL
    },
    favouriteFlower: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Pre-save Hook: Hash password before saving ──
userSchema.pre("save", async function () {
  // Only hash if the password field has been modified (or is new)
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// ── Instance Method: Compare plaintext password with hashed ──
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// ── Instance Method: Generate a JWT ──
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: (process.env.JWT_EXPIRY || "7d") as string,
    } as jwt.SignOptions
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
