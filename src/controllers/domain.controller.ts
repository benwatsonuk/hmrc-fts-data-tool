import { Request, Response } from "express";
import domainService from "../services/domain.service";

export async function getDomainInfo(
  req: Request,
  res: Response
): Promise<void> {
  const domain = req.params.domain;

  if (!domain || Array.isArray(domain)) {
    res.status(400).json({
      message: "Invalid domain parameter"
    });
    return;
  }

  try {
    const result = await domainService.lookup(domain);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve domain information"
    });
  }
}