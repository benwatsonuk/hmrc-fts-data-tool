import axios from "axios";

export default {
  async lookup(domain: string) {
    const response = await axios.get(
      `${process.env.WHOIS_API_URL}`,
      {
        params: {
          domainName: domain,
          apiKey: process.env.WHOIS_API_KEY,
          outputFormat: "JSON"
        }
      }
    );
    return response.data;
  }
};