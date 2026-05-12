import companyEnrichClient from "../clients/company-enrich.client";
import companiesHouseClient from "../clients/companies-house.client";
import {
  findByDomain,
  save,
  isFresh
} from "../database/organisation.repository";
export default {
  async lookup(domain: string) {
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
      null;
    let companiesHouse = null;
    if (companyName) {
      companiesHouse = await companiesHouseClient.search(
        companyName
      );
    }
    const result = {
      domain,
      companyName,
      legalName:
        companiesHouse?.title || companyName,
      companyNumber:
        companiesHouse?.company_number || null,
      industry:
        companyEnrich.industry || null,
      website:
        companyEnrich.website || null,
      linkedinUrl:
        companyEnrich.linkedin_url || null,
      companiesHouseStatus:
        companiesHouse?.company_status || null,
      confidenceScore: companiesHouse ? 85 : 60,
      sourceData: {
        companyEnrich,
        companiesHouse
      },
      lastChecked: new Date().toISOString()
    };
    await save(result);
    return result;
  }
};