import type { KycRequest, CountryVerificationResult } from "../types";

// ACRA BizFile+ public API (business entity lookup)
const ACRA_API = "https://data.gov.sg/api/action/datastore_search";
const ACRA_RESOURCE_ID = "5ab68aac-91f6-4f39-9b21-698610bdf3f8";

async function verifyAcra(identifier: string): Promise<boolean> {
  const params = new URLSearchParams({
    resource_id: ACRA_RESOURCE_ID,
    q: identifier,
    limit: "1",
  });

  const res = await fetch(`${ACRA_API}?${params}`, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) return false;

  const json = (await res.json()) as { result?: { total?: number } };
  return (json.result?.total ?? 0) > 0;
}

function validateNric(identifier: string): boolean {
  // Singapore NRIC/FIN: S/T/F/G + 7 digits + 1 letter
  return /^[STFG]\d{7}[A-Z]$/.test(identifier.toUpperCase());
}

export async function verifySingapore(req: KycRequest): Promise<CountryVerificationResult> {
  const dataSources: string[] = [];
  let verified = false;

  if (req.entity_type === "corporate") {
    dataSources.push("ACRA BizFile+ (Singapore)");
    verified = await verifyAcra(req.identifier);
  } else {
    dataSources.push("NRIC/FIN Format Validation (Singapore)");
    verified = validateNric(req.identifier);
  }

  const riskIndicators: string[] = [];
  if (!verified) riskIndicators.push("IDENTITY_NOT_FOUND");

  return { verified, dataSource: dataSources.join(", "), riskIndicators };
}
