// src/schemas/domain.schema.ts

export interface DomainParams {
  domain: string;
}

export function validateDomain(
  domain: string
): boolean {
  const domainRegex =
    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return domainRegex.test(domain);
}