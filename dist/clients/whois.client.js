"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async lookup(domain) {
        return {
            organisationName: `Example Org for ${domain}`,
            registrar: "Example Registrar",
            createdDate: "2024-01-01"
        };
    }
};
