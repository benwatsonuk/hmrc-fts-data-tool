import axios from "axios";
export default {
    async lookup(domain: string) {
        const response = await axios.get(
            `${process.env.COMPANY_ENRICH_API_URL}`,
            {
                params: {
                    domain
                },
                headers: {
                    Authorization: `Bearer ${process.env.COMPANY_ENRICH_API_KEY}`
                }
            }
        );
        return response.data;
    }
};