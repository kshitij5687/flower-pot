import { Router } from "express";
import { signup, login, logout } from "./auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

// ──────────────────────────────────────────────────────────────
//  Auth Routes
//
//  POST /signup  — Public. Accepts multipart form with optional
//                  "image" file field. Creates user & sets cookie.
//  POST /login   — Public. JSON body with email & password.
//  POST /logout  — Protected. Clears the accessToken cookie.
// ──────────────────────────────────────────────────────────────

const router = Router();

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);

export default router;
