"use strict";
// src/schemas/domain.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomain = validateDomain;
function validateDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}
