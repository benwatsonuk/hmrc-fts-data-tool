"use strict";
// src/routes/domain.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_controller_1 = require("../controllers/domain.controller");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
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
router.get("/:domain", validate_1.validateDomainParam, domain_controller_1.getDomainInfo);
exports.default = router;
