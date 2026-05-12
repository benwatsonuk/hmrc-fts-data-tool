// src/routes/domain.routes.ts

import { Router } from "express";
import { getDomainInfo } from "../controllers/domain.controller";
import { validateDomainParam } from "../middleware/validate";

const router = Router();

/**
 * @swagger
 * /api/domain/{domain}:
 *   get:
 *     summary: Get organisation data from a domain
 *     tags:
 *       - Domain
 *     parameters:
 *       - in: path
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         example: google.co.uk
 *     responses:
 *       200:
 *         description: Domain information returned successfully
 *       400:
 *         description: Invalid domain supplied
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:domain",
  validateDomainParam,
  getDomainInfo
);

export default router;