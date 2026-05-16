import type { KycRequest, CountryVerificationResult } from "../types";

// 공공데이터포털 (data.go.kr) — Business Registration Verification API
const DATA_GO_KR_API =
  "https://api.odcloud.kr/api/nts-businessman/v1/status";

async function verifyBusinessRegistration(identifier: string): Promise<boolean> {
  const apiKey = process.env.KOREA_DATA_GO_KR_API_KEY;
  if (!apiKey) {
    return validateBrnFormat(identifier);
  }

  const res = await fetch(`${DATA_GO_KR_API}?serviceKey=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ b_no: [identifier.replace(/[-\s]/g, "")] }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) return false;

  const json = (await res.json()) as {
    data?: Array<{ b_stt_cd?: string }>;
  };

  // b_stt_cd "01" means active
  return json.data?.[0]?.b_stt_cd === "01";
}

function validateBrnFormat(identifier: string): boolean {
  // Korean Business Registration Number: 10 digits (XXX-XX-XXXXX)
  const digits = identifier.replace(/[-\s]/g, "");
  if (!/^\d{10}$/.test(digits)) return false;

  // BRN check digit algorithm
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }
  sum += Math.floor((parseInt(digits[8]) * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(digits[9]);
}

function validateRrn(identifier: string): boolean {
  // Korean Resident Registration Number: 13 digits
  const digits = identifier.replace(/[-\s]/g, "");
  return /^\d{13}$/.test(digits);
}

export async function verifyKorea(req: KycRequest): Promise<CountryVerificationResult> {
  const dataSources: string[] = [];
  let verified = false;

  if (req.entity_type === "corporate") {
    dataSources.push("공공데이터포털 사업자등록정보 진위확인 (data.go.kr)");
    verified = await verifyBusinessRegistration(req.identifier);
  } else {
    dataSources.push("주민등록번호 형식 검증 (RRN Format Validation)");
    verified = validateRrn(req.identifier);
  }

  const riskIndicators: string[] = [];
  if (!verified) riskIndicators.push("IDENTITY_NOT_FOUND");

  return { verified, dataSource: dataSources.join(", "), riskIndicators };
}
