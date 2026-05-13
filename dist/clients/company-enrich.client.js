"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = {
    async lookup(domain) {
        const response = await axios_1.default.get(`${process.env.COMPANY_ENRICH_API_URL}`, {
            params: {
                domain
            },
            headers: {
                Authorization: `Bearer ${process.env.COMPANY_ENRICH_API_KEY}`
            }
        });
        return response.data;
    }
};
