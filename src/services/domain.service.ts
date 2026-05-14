import { safeCall } from "../utils/safe-call";
import companyEnrichClient from "../clients/company-enrich.client";
import findCompanyNumber from "../utils/find-company-number";
import isValidDomain from "../utils/is-valid-domain";
import companiesHouseClient from "../clients/companies-house.client";
import {
  findByDomain,
  save,
  isFresh,
  OrganisationRecord
} from "../database/organisation.repository";
import whoisClient from "../clients/whois.client";

export type LookupResult = {
  success: boolean
  message: string
  data: OrganisationRecord | null
}

export default {
  async lookup(domain: string): Promise<LookupResult> {

    /**
     * 0. CHECK WHETHER DOMAIN IS VALID
     */
    if (!isValidDomain(domain)) {
      throw new Error(
        `Invalid domain provided: ${domain}`
      );
    }

    /**
     * 1. CACHE FIRST (critical fix)
     */
    const cached = await findByDomain(domain);

    if (cached && isFresh(cached.lastChecked)) {
      console.log(`Cache hit for ${domain}`);
      return {
        success: true,
        message: "Returned from cache",
        data: cached
      }
    }

    console.log(`Cache miss for ${domain}`);



    /**
     * 2. FAST DOMAIN SIGNALS (non-blocking enrichment inputs)
     */
    console.log(
      `Attempting to locate company number for: ${domain}`
    );
    const companyNumberFromDomain = await safeCall(
      "Find company number from domain",
      () => findCompanyNumber(domain)
    );

    if (!companyNumberFromDomain?.homepageAvailable) {
      console.log(
        `No homepage found for: ${domain}`
      );
      return {
        success: false,
        message: "That domain does not appear to be valid. Please try another domain.",
        data: null
      }
    }
    else {
      if (!companyNumberFromDomain?.companyNumber) {
        console.log(
          `Found company number from domain: ${companyNumberFromDomain}`
        );
      } else {
        console.log(
          `No company number found from domain for ${domain}`
        );
      }
    }

    /**
     * 3. WHOIS (soft dependency)
     */
    console.log(
      `Performing WhoIs lookup for ${domain}`
    );
    const whoIsData = await safeCall(
      "Whois lookup",
      () => whoisClient.lookup(domain)
    );

    /**
     * 4. COMPANIES HOUSE (only if we have a lead)
     */
    let companiesHouseData: any = null;
    let companyLegalName: string | null = null;

    if (companyNumberFromDomain?.companyNumber) {
      console.log(
        `Performing Companies House search for ${domain}`
      );
      companiesHouseData = await safeCall(
        "Companies House search",
        () =>
          companiesHouseClient.search(
            companyNumberFromDomain?.companyNumber
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
    console.log(
      `Performing Company Enrichment for ${domain}`
    );
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
      companyNumberFromDomain?.companyNumber ||
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
     * 8. CHECK WHETHER WE HAVE ANY USEFUL DATA TO CACHE (critical fix to avoid caching failed lookups
     */
    const hasUsefulData =
      !!companyEnrich ||
      !!companiesHouseData ||
      !!whoIsData ||
      !!companyNumber;

    if (!hasUsefulData) {
      console.log(
        `Skipping cache save for ${domain} — no useful enrichment found`
      );

      return {
        success: false,
        message:
          "No useful organisation data could be found for this domain",
        data: null
      };
    }

    /**
     * 9. SAVE TO CACHE
     */
    const shouldSave =
      !!companyName ||
      !!companyNumber ||
      !!companiesHouseData?.company_name;

    if (!shouldSave) {
      console.log(
        `Skipping save for ${domain} — nothing usefule here, insufficient enrichment`
      );

      return {
        success: false,
        message:
          "No useful organisation data could be found for this domain",
        data: null
      };
    }

    await save(result);

    /**
     * 10. RETURN WHAT WE HAVE
     */
    return {
      success: true,
      message: "Lookup successful",
      data: result
    };
  }
};