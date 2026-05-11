"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whois_client_1 = __importDefault(require("../clients/whois.client"));
exports.default = {
    async lookup(domain) {
        const whois = await whois_client_1.default.lookup(domain);
        return {
            domain,
            organisationName: whois.organisationName,
            registrar: whois.registrar,
            createdDate: whois.createdDate,
            source: "whois"
        };
    }
};
