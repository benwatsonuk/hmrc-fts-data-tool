import axios from "axios";

export default {
    async lookup(domain: string) {
        const response = await axios.post(
            `${process.env.COMPANY_ENRICH_API_URL}`,
            {
                domain
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COMPANY_ENRICH_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
};