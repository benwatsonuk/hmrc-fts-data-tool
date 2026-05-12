import axios from "axios";

console.log("ENV: " +
    JSON.stringify(process.env.COMPANIES_HOUSE_API_KEY)
);

export default {
    async search(companyName: string) {
        const response = await axios.get(
            process.env.COMPANIES_HOUSE_API_URL + "/search/companies",
            {
                params: {
                    q: companyName
                },
                headers: {
                    username: process.env.COMPANIES_HOUSE_API_KEY || "",
                    password: ""
                }
                ,
            }
        );
        return response.data.items?.[0] || null;
    }
};