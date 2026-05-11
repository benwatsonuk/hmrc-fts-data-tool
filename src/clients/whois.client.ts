export default {
  async lookup(domain: string) {
    return {
      organisationName: `Example Org for ${domain}`,
      registrar: "Example Registrar",
      createdDate: "2024-01-01"
    };
  }
};