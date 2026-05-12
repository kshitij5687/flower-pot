import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

// ──────────────────────────────────────────────────────────────
//  User Routes
//
//  All routes here are PROTECTED — verifyJWT runs first.
//
//  GET   /profile  — Fetch the logged-in user's profile
//  PATCH /profile  — Update profile (name, favouriteFlower, image)
//                     Image is uploaded via multer (single file
//                     field named "image").
// ──────────────────────────────────────────────────────────────

const router = Router();

// All user routes require authentication
router.use(verifyJWT);

router.route("/profile")
  .get(getProfile)
  .patch(upload.single("image"), updateProfile);

export default router;
