// ──────────────────────────────────────────────────────────────
//  Express Request Augmentation
//
//  This file extends the Express Request interface globally.
//  Using dynamic import() means this file remains a global script
//  rather than a module, which makes the augmentation more reliable
//  across different TypeScript module resolution settings.
// ──────────────────────────────────────────────────────────────

declare namespace Express {
  export interface Request {
    user?: import("../user/user.model").IUser;
  }
}
