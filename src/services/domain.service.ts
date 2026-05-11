import whoisClient from "../clients/whois.client";

export default {
  async lookup(domain: string) {
    const whois = await whoisClient.lookup(domain);

    return {
      domain,
      organisationName: whois.organisationName,
      registrar: whois.registrar,
      createdDate: whois.createdDate,
      source: "whois"
    };
  }
};