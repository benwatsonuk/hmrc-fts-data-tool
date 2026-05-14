// src/utils/find-company-number.ts

import axios from "axios";
import * as cheerio from "cheerio";

export default async function findCompanyNumber(
    domain: string
): Promise<{
    homepageAvailable: boolean;
    companyNumber: string | null;
}> {
    const baseUrl = domain.startsWith("http")
        ? domain
        : `https://${domain}`;

    /**
     * Pages commonly containing legal entity details
     */
    const pathsToCheck = [
        "/",
        "/privacy",
        "/privacy-policy",
        "/terms",
        "/terms-and-conditions",
        "/legal",
        "/about",
        "/about-us",
        "/contact",
        "/contact-us"
    ];

    /**
   * UK company number matcher
   *
   * Matches:
   * 06014477
   * Company No. 06014477
   * Registered Number: 06014477
   */
    const companyNumberRegex =
        /\b(?:company\s*(?:no|number)?\.?\s*[:#]?\s*)?(\d{8})\b/i;

    let homepageAvailable = false;

    for (const path of pathsToCheck) {
        try {
            const url = new URL(path, baseUrl).toString();

            console.log(`Checking: ${url}`);

            const response = await axios.get(url, {
                timeout: 10000,
                validateStatus: () => true,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (compatible; DomainLookupBot/1.0)"
                }
            });

            /**
             * Only homepage determines whether
             * the domain is considered reachable
             */
            if (path === "/" && response.status === 200) {
                homepageAvailable = true;
            }

            /**
             * Skip non-200 pages except continue checking
             */
            if (response.status !== 200) {
                console.log(
                    `Skipping ${url} (HTTP ${response.status})`
                );
                continue;
            }

            const $ = cheerio.load(response.data);

            /**
             * Try footer first, then fallback to full body
             */
            const pageText =
                $("footer").text() ||
                $(".footer").text() ||
                $("#footer").text() ||
                $("body").text();

            const match = pageText.match(
                companyNumberRegex
            );

            if (match && match[1]) {
                console.log(
                    `Found company number ${match[1]} on ${url}`
                );

                return {
                    homepageAvailable,
                    companyNumber: match[1]
                };
            }
        } catch (error) {
            /**
             * Ignore missing pages/network issues
             * and continue checking other paths
             */
            console.log(
                `Skipping ${path} (not found or inaccessible)`
            );
        }
    }

    console.log(
        `No company number found for ${domain}`
    );

    return {
        homepageAvailable,
        companyNumber: null
    };
}