"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainInfo = getDomainInfo;
const domain_service_1 = __importDefault(require("../services/domain.service"));
async function getDomainInfo(req, res) {
    const domain = req.params.domain;
    if (!domain || Array.isArray(domain)) {
        res.status(400).json({
            message: "Invalid domain parameter"
        });
        return;
    }
    try {
        const result = await domain_service_1.default.lookup(domain);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve domain information"
        });
    }
}
