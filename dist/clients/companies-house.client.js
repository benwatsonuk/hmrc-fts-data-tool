"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
console.log("ENV: " +
    JSON.stringify(process.env.COMPANIES_HOUSE_API_KEY));
exports.default = {
    async search(companyName) {
        const response = await axios_1.default.get(process.env.COMPANIES_HOUSE_API_URL + "/search/companies", {
            params: {
                q: companyName
            },
            headers: {
                username: process.env.COMPANIES_HOUSE_API_KEY || "",
                password: ""
            },
        });
        return response.data.items?.[0] || null;
    }
};
