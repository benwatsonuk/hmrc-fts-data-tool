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
    const companyNumberFromDomain: string | null = await findCompanyNumber(domain);
    let companyLegalName: string | null = null;
    let companiesHouseData: any = null;
    let whoIsData: any = null;

    console.log(`Company number from domain: ${companyNumberFromDomain}`);

    if (companyNumberFromDomain) {
      const companiesHouseData = await companiesHouseClient.search(
        companyNumberFromDomain
      );
      console.log(`Companies House data: ${JSON.stringify(companiesHouseData)}`);

      if (companiesHouseData) {
        companyLegalName = companiesHouseData.company_name || null;
        console.log(
          `Company legal name from Companies House: ${companyLegalName}`
        );
      }
    }

    whoIsData = await whoisClient.lookup(domain);
    console.log(`WhoIs data: ${JSON.stringify(whoIsData)}`);

    const cached = await findByDomain(domain);
    if (cached && isFresh(cached.lastChecked)) {
      console.log(`Cache hit for ${domain}`);
      return cached;
    }
    console.log(`Fresh lookup for ${domain}`);
    const companyEnrich = await companyEnrichClient.lookup(domain);
    const companyName =
      companyEnrich.company_name ||
      companyEnrich.name ||
      companyLegalName ||
      null;

    const result = {
      domain,
      companyName,
      legalName:
        companyLegalName || companyName,
      companyNumber:
        companyNumberFromDomain || null,
      industry:
        companyEnrich.industry || null,
      website:
        companyEnrich.website || null,
      linkedinUrl:
        companyEnrich.linkedin_url || null,
      companiesHouseStatus:
        companiesHouseData?.company_status || null,
      confidenceScore: companiesHouseData ? 85 : 60,
      sourceData: {
        companyEnrich,
        companiesHouseData,
        whoIsData
      },
      lastChecked: new Date().toISOString()
    };
    await save(result);
    return result;
  }
};