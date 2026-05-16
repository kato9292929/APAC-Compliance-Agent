import type { KycRequest, KycResponse, RiskScore } from "./types";
import { verifyJapan } from "./countries/japan";
import { verifySingapore } from "./countries/singapore";
import { verifyHongKong } from "./countries/hongkong";
import { verifyAustralia } from "./countries/australia";
import { verifyKorea } from "./countries/korea";
import { runAmlScreening } from "../aml/screening";

type VerifyFn = (req: KycRequest) => Promise<{ verified: boolean; dataSource: string; riskIndicators: string[] }>;

const COUNTRY_VERIFIERS: Record<string, VerifyFn> = {
  JP: verifyJapan,
  SG: verifySingapore,
  HK: verifyHongKong,
  AU: verifyAustralia,
  KR: verifyKorea,
};

function computeRiskScore(
  verified: boolean,
  amlClear: boolean,
  riskIndicators: string[]
): RiskScore {
  if (!amlClear || riskIndicators.length > 1) return "high";
  if (!verified || riskIndicators.length === 1) return "medium";
  return "low";
}

export async function runKycVerification(req: KycRequest): Promise<KycResponse> {
  const verifyFn = COUNTRY_VERIFIERS[req.country];
  if (!verifyFn) {
    throw new Error(`Unsupported country: ${req.country}`);
  }

  const [countryResult, amlResult] = await Promise.all([
    verifyFn(req),
    runAmlScreening(req.name),
  ]);

  const riskScore = computeRiskScore(
    countryResult.verified,
    amlResult.aml_clear,
    countryResult.riskIndicators
  );

  return {
    verified: countryResult.verified,
    risk_score: riskScore,
    aml_clear: amlResult.aml_clear,
    sanctions_clear: amlResult.sanctions_clear,
    pep_clear: amlResult.pep_clear,
    data_sources: [countryResult.dataSource, ...amlResult.dataSources],
    timestamp: new Date().toISOString(),
  };
}
