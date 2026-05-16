import type { KycRequest, CountryVerificationResult } from "../types";

// Australian Business Register (ABR) ABN Lookup API
const ABR_API = "https://abr.business.gov.au/json/AbnDetails.aspx";

async function verifyAbn(abn: string): Promise<boolean> {
  const guid = process.env.ABR_GUID ?? "";
  if (!guid) {
    // Fallback: validate ABN format (11 digits, passes checksum)
    return validateAbnFormat(abn);
  }

  const params = new URLSearchParams({ abn: abn.replace(/\s/g, ""), guid });
  const res = await fetch(`${ABR_API}?${params}`, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) return false;

  const text = await res.text();
  // ABR returns JSONP; valid entity has EntityTypeCode present
  return text.includes('"EntityTypeCode"') && !text.includes('"AbnStatus":"Cancelled"');
}

function validateAbnFormat(abn: string): boolean {
  const digits = abn.replace(/\s/g, "");
  if (!/^\d{11}$/.test(digits)) return false;

  // ABN checksum algorithm
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const adjusted = [parseInt(digits[0]) - 1, ...digits.slice(1).split("").map(Number)];
  const sum = adjusted.reduce((acc, d, i) => acc + d * weights[i], 0);
  return sum % 89 === 0;
}

function validatePassportAU(identifier: string): boolean {
  // Australian passport: 1-2 letters + 6-7 digits
  return /^[A-Z]{1,2}\d{6,7}$/i.test(identifier.trim());
}

export async function verifyAustralia(req: KycRequest): Promise<CountryVerificationResult> {
  const dataSources: string[] = [];
  let verified = false;

  if (req.entity_type === "corporate") {
    dataSources.push("Australian Business Register (ABR)");
    verified = await verifyAbn(req.identifier);
  } else {
    dataSources.push("Australian Passport Format Validation");
    verified = validatePassportAU(req.identifier);
  }

  const riskIndicators: string[] = [];
  if (!verified) riskIndicators.push("IDENTITY_NOT_FOUND");

  return { verified, dataSource: dataSources.join(", "), riskIndicators };
}
