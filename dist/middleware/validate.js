"use strict";
// src/middleware/validate.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomainParam = validateDomainParam;
const domain_schema_1 = require("../schemas/domain.schema");
function validateDomainParam(req, res, next) {
    const domain = req.params.domain;
    if (!domain || Array.isArray(domain)) {
        res.status(400).json({
            message: "Domain parameter is required"
        });
        return;
    }
    if (!(0, domain_schema_1.validateDomain)(domain)) {
        res.status(400).json({
            message: "Invalid domain format"
        });
        return;
    }
    next();
}
