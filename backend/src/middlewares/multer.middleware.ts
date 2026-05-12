import multer from "multer";
import path from "path";
import { Request } from "express";

// ──────────────────────────────────────────────────────────────
//  Multer Middleware — Handles multipart/form-data file uploads.
//
//  Files are stored in memory as buffers and then uploaded to
//  Camel Cloud by the controller.
//
//  A file filter restricts uploads to common image formats.
// ──────────────────────────────────────────────────────────────

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

export { upload };
