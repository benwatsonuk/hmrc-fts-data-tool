export default function isValidDomain(
    domain: string
): boolean {
    const normalized = domain
        .trim()
        .toLowerCase();

    const domainRegex =
        /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    return domainRegex.test(normalized);
}