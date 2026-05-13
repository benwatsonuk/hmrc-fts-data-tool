"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByDomain = findByDomain;
exports.save = save;
exports.isFresh = isFresh;
const db_1 = __importDefault(require("./db"));
function isFresh(lastChecked) {
    const last = new Date(lastChecked).getTime();
    const now = Date.now();
    const days30 = 1000 * 60 * 60 * 24 * 30;
    return now - last < days30;
}
function findByDomain(domain) {
    return new Promise((resolve, reject) => {
        db_1.default.get(`SELECT * FROM organisation_cache WHERE domain = ?`, [domain], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                resolve(null);
                return;
            }
            resolve({
                domain: row.domain,
                companyName: row.company_name,
                legalName: row.legal_name,
                companyNumber: row.company_number,
                industry: row.industry,
                website: row.website,
                linkedinUrl: row.linkedin_url,
                companiesHouseStatus: row.companies_house_status,
                confidenceScore: row.confidence_score,
                sourceData: row.source_data ? JSON.parse(row.source_data) : null,
                lastChecked: row.last_checked
            });
        });
    });
}
function save(record) {
    return new Promise((resolve, reject) => {
        db_1.default.run(`
            INSERT OR REPLACE INTO organisation_cache (
            domain,
            company_name,
            legal_name,
            company_number,
            industry,
            website,
            linkedin_url,
            companies_house_status,
            confidence_score,
            source_data,
            last_checked,
            updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [
            record.domain,
            record.companyName || null,
            record.legalName || null,
            record.companyNumber || null,
            record.industry || null,
            record.website || null,
            record.linkedinUrl || null,
            record.companiesHouseStatus || null,
            record.confidenceScore || 0,
            JSON.stringify(record.sourceData || {}),
            record.lastChecked
        ], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
