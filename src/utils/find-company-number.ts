// src/utils/find-company-number.ts

import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Looks for a UK Companies House company number
 * in the footer of a webpage.
 *
 * Examples:
 * 06014477
 * Company No. 06014477
 * Registered in England and Wales No. 06014477
 */

export default async function findCompanyNumber(
    domain: string
): Promise<string | null> {
    try {
        // Ensure protocol exists
        const url = domain.startsWith("http")
            ? domain
            : `https://${domain}`;

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (compatible; DomainLookupBot/1.0)"
            }
        });

        const $ = cheerio.load(response.data);

        /**
         * Common footer selectors to try first
         */
        const footerText =
            $("footer").text() ||
            $(".footer").text() ||
            $("#footer").text() ||
            $("body").text();

        /**
         * UK company number pattern:
         * Usually 8 digits
         *
         * Examples:
         * 06014477
         * 12345678
         *
         * Also supports:
         * Company No. 06014477
         * Registered number: 06014477
         */
        const companyNumberRegex =
            /\b(?:company\s*(?:no|number)?\.?\s*[:#]?\s*)?(\d{8})\b/i;

        const match = footerText.match(companyNumberRegex);

        if (match && match[1]) {
            console.log(
                `Found company number: ${match[1]}`
            );
            return match[1];
        }

        console.log(
            `No company number found for ${domain}`
        );

        return null;
    } catch (error) {
        console.error(
            `Failed to scan ${domain}:`,
            error
        );

        return null;
    }
}