import axios from "axios";

export default {
  async lookup(domain: string) {
    const url = `${process.env.WHOIS_API_URL}`;
    const params = {
      domainName: domain,
      apiKey: process.env.WHOIS_API_KEY,
      outputFormat: "JSON"
    };

    // console.log('WHOIS Request:', {
    //   url,
    //   params,
    //   fullUrl: `${url}?${new URLSearchParams(params as any).toString()}`
    // });

    const response = await axios.get(url, { params });

    // console.log('WHOIS Response:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   data: response.data
    // });

    return response.data;
  }
};