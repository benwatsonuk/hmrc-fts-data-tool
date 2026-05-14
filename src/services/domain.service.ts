import { safeCall } from "../utils/safe-call";
import companyEnrichClient from "../clients/company-enrich.client";
import findCompanyNumber from "../utils/find-company-number";
import companiesHouseClient from "../clients/companies-house.client";
import {
  findByDomain,
  save,
  isFresh
} from "../database/organisation.repository";
import whoisClient from "../clients/whois.client";

export default {
  async lookup(domain: string) {
    /**
     * 1. CACHE FIRST (critical fix)
     */
    const cached = await findByDomain(domain);

    if (cached && isFresh(cached.lastChecked)) {
      console.log(`Cache hit for ${domain}`);
      return cached;
    }

    console.log(`Cache miss for ${domain}`);

    /**
     * 2. FAST DOMAIN SIGNALS (non-blocking enrichment inputs)
     */
    const companyNumberFromDomain = await safeCall(
      "Find company number from domain",
      () => findCompanyNumber(domain)
    );

    if (companyNumberFromDomain && process.env.ENABLE_DEBUG_LOGGING === "true") {
      console.log(
        `Found company number from domain: ${companyNumberFromDomain}`
      );
    }

    /**
     * 3. WHOIS (soft dependency)
     */
    const whoIsData = await safeCall(
      "Whois lookup",
      () => whoisClient.lookup(domain)
    );

    /**
     * 4. COMPANIES HOUSE (only if we have a lead)
     */
    let companiesHouseData: any = null;
    let companyLegalName: string | null = null;

    if (companyNumberFromDomain) {
      companiesHouseData = await safeCall(
        "Companies House search",
        () =>
          companiesHouseClient.search(
            companyNumberFromDomain
          )
      );

      if (companiesHouseData) {
        companyLegalName =
          companiesHouseData.company_name || null;
        if (process.env.ENABLE_DEBUG_LOGGING === "true") {
          console.log(
            `Company legal name: ${companyLegalName}`
          );
        }
      }
    }

    /**
     * 5. ENRICHMENT API (best-effort)
     */
    const companyEnrich = await safeCall(
      "Company Enrich",
      () =>
        companyEnrichClient.lookup(domain)
    );

    /**
     * 6. DERIVE CORE FIELDS
     */
    const companyName =
      companyEnrich?.company_name ||
      companyEnrich?.name ||
      companyLegalName ||
      null;

    const companyNumber =
      companyNumberFromDomain ||
      companiesHouseData?.company_number ||
      null;

    /**
     * 7. FINAL RESULT OBJECT
     */
    const result = {
      domain,

      companyName,

      legalName:
        companyLegalName || companyName,

      companyNumber,

      revenue: companyEnrich?.revenue || null,
      employees: companyEnrich?.employees || null,
      description:
        companyEnrich?.description || null,
      categories:
        companyEnrich?.categories || null,
      address: companyEnrich?.location?.address || null,
      industries:
        companyEnrich?.industries || null,

      createdOn:
        companiesHouseData?.date_of_creation ||
        null,

      jurisdiction:
        companiesHouseData?.jurisdiction || null,

      sicCodes:
        companiesHouseData?.sic_codes || null,

      organisationType:
        companiesHouseData?.type || null,

      logoUrl:
        companyEnrich?.logo_url || null,

      companiesHouseLinks:
        companiesHouseData?.links || null,

      previousCompanyNames:
        companiesHouseData?.previous_company_names ||
        null,

      estimatedDomainAge:
        whoIsData?.WhoisRecord
          ?.estimatedDomainAge || null,

      industry:
        companyEnrich?.industry || null,

      website:
        companyEnrich?.website || null,

      linkedinUrl:
        companyEnrich?.linkedin_url || null,

      companiesHouseStatus:
        companiesHouseData?.company_status ||
        null,

      confidenceScore:
        companiesHouseData ? 85 : 60,

      sourceData: {
        companyEnrich,
        companiesHouseData,
        whoIsData
      },

      lastChecked: new Date().toISOString()
    };

    /**
     * 8. SAVE TO CACHE
     */
    await save(result);

    return result;
  }
};