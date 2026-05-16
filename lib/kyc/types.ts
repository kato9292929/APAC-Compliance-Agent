import { z } from "zod";

export const KycRequestSchema = z.object({
  entity_type: z.enum(["individual", "corporate"]),
  country: z.enum(["JP", "SG", "HK", "AU", "KR"]),
  name: z.string().min(1).max(500),
  identifier: z.string().min(1).max(100),
  world_proof: z.string().min(1),
});

export type KycRequest = z.infer<typeof KycRequestSchema>;

export type RiskScore = "low" | "medium" | "high";

export interface KycResponse {
  verified: boolean;
  risk_score: RiskScore;
  aml_clear: boolean;
  sanctions_clear: boolean;
  pep_clear: boolean;
  data_sources: string[];
  timestamp: string;
}

export interface CountryVerificationResult {
  verified: boolean;
  dataSource: string;
  riskIndicators: string[];
}

export interface AmlScreeningResult {
  aml_clear: boolean;
  sanctions_clear: boolean;
  pep_clear: boolean;
  dataSources: string[];
}
