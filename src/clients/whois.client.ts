import axios from "axios";

export default {
  async lookup(domain: string) {
    // Replace with real provider later

    return {
      organisationName: `Example Org for ${domain}`,
      registrar: "Example Registrar",
      createdDate: "2024-01-01"
    };
  }
};