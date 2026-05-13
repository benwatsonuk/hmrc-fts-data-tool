import db from "./db";

export interface OrganisationRecord {
    domain: string;
    companyName?: string | null;
    legalName?: string | null;
    companyNumber?: string | null;
    jurisdiction?: string | null;
    sicCodes?: string[] | null;
    organisationType?: string | null;
    logoUrl?: string | null;
    address?: string | null;
    companiesHouseLinks?: any | null;
    previousCompanyNames?: string[] | null;
    estimatedDomainAge?: number | null;
    industry?: string | null;
    categories?: string[] | null;
    industries?: string[] | null;
    revenue?: string | null;
    employees?: string | null;
    description?: string | null;
    createdOn?: string | null;
    website?: string | null;
    linkedinUrl?: string | null;
    companiesHouseStatus?: string | null;
    confidenceScore?: number;
    sourceData?: unknown;
    lastChecked: string;
}
function isFresh(lastChecked: string): boolean {
    const last = new Date(lastChecked).getTime();
    const now = Date.now();
    const days30 = 1000 * 60 * 60 * 24 * 30;
    return now - last < days30;
}

export function findByDomain(
    domain: string
): Promise<OrganisationRecord | null> {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM organisation_cache WHERE domain = ?`,
            [domain],
            (err, row: any) => {
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
                    jurisdiction: row.jurisdiction,
                    sicCodes: row.sic_codes ? JSON.parse(row.sic_codes) : null,
                    organisationType: row.organisation_type,
                    logoUrl: row.logo_url,
                    companiesHouseLinks: row.companies_house_links ? JSON.parse(row.companies_house_links) : null,
                    previousCompanyNames: row.previous_company_names ? JSON.parse(row.previous_company_names) : null,
                    estimatedDomainAge: row.estimated_domain_age,
                    industry: row.industry,
                    categories: row.categories ? JSON.parse(row.categories) : null,
                    industries: row.industries ? JSON.parse(row.industries) : null,
                    revenue: row.revenue,
                    employees: row.employees,
                    description: row.description,
                    createdOn: row.created_on,
                    website: row.website,
                    linkedinUrl: row.linkedin_url,
                    companiesHouseStatus: row.companies_house_status,
                    confidenceScore: row.confidence_score,
                    sourceData: row.source_data ? JSON.parse(row.source_data) : null,
                    lastChecked: row.last_checked,
                    address: row.address || null
                });
            }
        );
    });
}
export function save(record: OrganisationRecord): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT OR REPLACE INTO organisation_cache (
            domain,
            company_name,
            legal_name,
            company_number,
            jurisdiction,
            sic_codes,
            organisation_type,
            logo_url,
            companies_house_links,
            previous_company_names,
            estimated_domain_age,
            industry,
            categories,
            industries,
            revenue,
            employees,
            description,
            created_on,
            website,
            linkedin_url,
            companies_house_status,
            confidence_score,
            source_data,
            last_checked,
            updated_at,
            address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `,
            [
                record.domain,
                record.companyName || null,
                record.legalName || null,
                record.companyNumber || null,
                record.jurisdiction || null,
                record.sicCodes ? JSON.stringify(record.sicCodes) : null,
                record.organisationType || null,
                record.logoUrl || null,
                record.companiesHouseLinks ? JSON.stringify(record.companiesHouseLinks) : null,
                record.previousCompanyNames ? JSON.stringify(record.previousCompanyNames) : null,
                record.estimatedDomainAge || null,
                record.industry || null,
                record.categories ? JSON.stringify(record.categories) : null,
                record.industries ? JSON.stringify(record.industries) : null,
                record.revenue || null,
                record.employees || null,
                record.description || null,
                record.createdOn || null,
                record.website || null,
                record.linkedinUrl || null,
                record.companiesHouseStatus || null,
                record.confidenceScore || 0,
                JSON.stringify(record.sourceData || {}),
                record.lastChecked,
                record.address || null
            ],
            (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
    });
}

export { isFresh };