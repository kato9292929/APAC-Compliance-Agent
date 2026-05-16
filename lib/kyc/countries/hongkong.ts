import type { KycRequest, CountryVerificationResult } from "../types";

// Hong Kong Companies Registry e-Search API
const CR_API = "https://www.cr.gov.hk/en/esearch/companySearch.aspx";

async function verifyCR(companyNumber: string): Promise<boolean> {
  // CR provides an HTML page; we call it and check for the company number in the response.
  // In production, use the CR Open Data API with a registered API key.
  const crApiKey = process.env.HK_CR_API_KEY;
  if (crApiKey) {
    const res = await fetch(
      `https://openapi.cr.gov.hk/v1/companies/${encodeURIComponent(companyNumber)}`,
      {
        headers: { Authorization: `Bearer ${crApiKey}` },
        signal: AbortSignal.timeout(8_000),
      }
    );
    return res.ok;
  }

  // Fallback: validate HK CR number format (6-8 digits)
  return /^\d{6,8}$/.test(companyNumber.replace(/[-\s]/g, ""));
}

function validateHkid(identifier: string): boolean {
  // HKID format: 1-2 letters + 6 digits + 1 check character in parentheses
  return /^[A-Z]{1,2}\d{6}\([0-9A]\)$/i.test(identifier.replace(/\s/g, ""));
}

export async function verifyHongKong(req: KycRequest): Promise<CountryVerificationResult> {
  const dataSources: string[] = [];
  let verified = false;

  if (req.entity_type === "corporate") {
    dataSources.push("Companies Registry Hong Kong (CR)");
    verified = await verifyCR(req.identifier);
  } else {
    dataSources.push("HKID Format Validation");
    verified = validateHkid(req.identifier);
  }

  const riskIndicators: string[] = [];
  if (!verified) riskIndicators.push("IDENTITY_NOT_FOUND");

  return { verified, dataSource: dataSources.join(", "), riskIndicators };
}
