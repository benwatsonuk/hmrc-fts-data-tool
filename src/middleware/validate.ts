// src/middleware/validate.ts

import { Request, Response, NextFunction } from "express";
import { validateDomain } from "../schemas/domain.schema";

export function validateDomainParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const domain = req.params.domain;

  if (!domain || Array.isArray(domain)) {
    res.status(400).json({
      message: "Domain parameter is required"
    });
    return;
  }

  if (!validateDomain(domain)) {
    res.status(400).json({
      message: "Invalid domain format"
    });
    return;
  }

  next();
}