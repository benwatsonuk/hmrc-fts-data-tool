import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  // Check if it's an axios error with response
  if (err.response) {
    res.status(err.response.status).json({
      message: err.response.data?.message || err.message
    });
  } else {
    res.status(500).json({
      message: err.message || "Internal server error"
    });
  }
};