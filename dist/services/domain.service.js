"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const company_enrich_client_1 = __importDefault(require("../clients/company-enrich.client"));
const companies_house_client_1 = __importDefault(require("../clients/companies-house.client"));
const organisation_repository_1 = require("../database/organisation.repository");
exports.default = {
    async lookup(domain) {
        const cached = await (0, organisation_repository_1.findByDomain)(domain);
        if (cached && (0, organisation_repository_1.isFresh)(cached.lastChecked)) {
            console.log(`Cache hit for ${domain}`);
            return cached;
        }
        console.log(`Fresh lookup for ${domain}`);
        const companyEnrich = await company_enrich_client_1.default.lookup(domain);
        const companyName = companyEnrich.company_name ||
            companyEnrich.name ||
            null;
        let companiesHouse = null;
        if (companyName) {
            companiesHouse = await companies_house_client_1.default.search(companyName);
        }
        const result = {
            domain,
            companyName,
            legalName: companiesHouse?.title || companyName,
            companyNumber: companiesHouse?.company_number || null,
            industry: companyEnrich.industry || null,
            website: companyEnrich.website || null,
            linkedinUrl: companyEnrich.linkedin_url || null,
            companiesHouseStatus: companiesHouse?.company_status || null,
            confidenceScore: companiesHouse ? 85 : 60,
            sourceData: {
                companyEnrich,
                companiesHouse
            },
            lastChecked: new Date().toISOString()
        };
        await (0, organisation_repository_1.save)(result);
        return result;
    }
};
