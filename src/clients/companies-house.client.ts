import axios from "axios";
export default {
    async search(companyName: string) {
        const response = await axios.get(
            "https://api.company-information.service.gov.uk/search/companies",
            {
                params: {
                    q: companyName
                },
                auth: {
                    username: process.env.COMPANIES_HOUSE_API_KEY || "",
                    password: ""
                }
                ,
            }
        );
        return response.data.items?.[0] || null;
    }
};