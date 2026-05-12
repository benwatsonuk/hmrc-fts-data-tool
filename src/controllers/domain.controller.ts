import { Request, Response, NextFunction } from "express";
import domainService from "../services/domain.service";

export async function getDomainInfo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const domain = req.params.domain as string;

    const result = await domainService.lookup(domain);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}