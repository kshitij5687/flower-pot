// ──────────────────────────────────────────────────────────────
//  ApiResponse — Uniform success response wrapper.
//
//  WHY:  Every successful response from the API should have the
//        same shape so the frontend can parse them consistently.
//
//  SHAPE:
//    {
//      statusCode: 200,
//      data:       { ... },
//      message:    "User fetched successfully",
//      success:    true
//    }
//
//  USAGE:
//    res.status(200).json(new ApiResponse(200, userData, "Profile fetched"));
// ──────────────────────────────────────────────────────────────

class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // 2xx & 3xx = success
  }
}

export { ApiResponse };
