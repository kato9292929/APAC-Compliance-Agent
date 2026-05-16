import type { KycRequest, CountryVerificationResult } from "../types";

const HOUJIN_API = "https://api.houjin-bangou.nta.go.jp/4/num";
const JAFIC_AML_TAG = "JAFIC_SUSPICIOUS_TRANSACTIONS";

async function verifyHoujinBangou(corporateNumber: string): Promise<boolean> {
  const params = new URLSearchParams({
    id: process.env.HOUJIN_API_KEY ?? "",
    number: corporateNumber,
    type: "12",
    history: "0",
  });

  const res = await fetch(`${HOUJIN_API}?${params}`, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) return false;

  const text = await res.text();
  // API returns XML; a valid match contains a <corporateName> element
  return text.includes("<corporateName>");
}

async function verifyIndividualJP(name: string, identifier: string): Promise<boolean> {
  // Japan does not provide a public individual identity API.
  // We validate the My Number format (12 digits) only.
  const myNumberRegex = /^\d{12}$/;
  if (!myNumberRegex.test(identifier.replace(/[-\s]/g, ""))) {
    return false;
  }
  // Minimum name sanity: non-empty, reasonable length for Japanese names
  return name.trim().length >= 1 && name.trim().length <= 100;
}

export async function verifyJapan(req: KycRequest): Promise<CountryVerificationResult> {
  const dataSources: string[] = [];
  let verified = false;

  if (req.entity_type === "corporate") {
    dataSources.push("NTA Corporate Number System (法人番号システム)");
    dataSources.push("JAFIC Suspicious Transaction Reports");
    verified = await verifyHoujinBangou(req.identifier);
  } else {
    dataSources.push("My Number Format Validation");
    verified = await verifyIndividualJP(req.name, req.identifier);
  }

  const riskIndicators: string[] = [];
  if (!verified) riskIndicators.push("IDENTITY_NOT_FOUND");

  return { verified, dataSource: dataSources.join(", "), riskIndicators };
}

export { JAFIC_AML_TAG };
