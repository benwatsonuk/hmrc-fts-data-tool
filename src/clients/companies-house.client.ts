import axios from "axios";

// console.log("ENV: " +
//     JSON.stringify(process.env.COMPANIES_HOUSE_API_KEY)
// );

const apiKey =
    process.env.COMPANIES_HOUSE_API_KEY || "";

function getAuthHeader(): string {
    const encoded = Buffer
        .from(`${apiKey}:`)
        .toString("base64");

    return `Basic ${encoded}`;
}

export const searchByName = {
    async search(companyName: string) {
        const response = await axios.get(
            process.env.COMPANIES_HOUSE_API_URL + "/search/companies",
            {
                params: {
                    q: companyName
                },
                headers: {
                    Authorization: getAuthHeader()
                }
                ,
            }
        );
        return response.data.items?.[0] || null;
    }
};

export default {
    // Search by Company Number
    async search(companyNumber: number) {
        const response = await axios.get(
            process.env.COMPANIES_HOUSE_API_URL + "/company/" + companyNumber,
            {
                headers: {
                    Authorization: getAuthHeader()
                }
            }
        );
        return response.data || null;

    }
}