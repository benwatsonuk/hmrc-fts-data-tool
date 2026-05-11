"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
const chai_1 = require("chai");
const domain_service_1 = __importDefault(require("../src/services/domain.service"));
describe("domainService", () => {
    it("should return domain information", async () => {
        const result = await domain_service_1.default.lookup("google.co.uk");
        (0, chai_1.expect)(result).to.have.property("domain");
        (0, chai_1.expect)(result.domain).to.equal("google.co.uk");
    });
});
