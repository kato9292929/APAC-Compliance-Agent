/**
 * Compliance audit logger.
 *
 * Logs are structured JSON written to stdout (or a configurable sink).
 * PII is minimised: only the identifier hash, country, entity type, and
 * outcome are stored — never raw names or full document numbers.
 */

import { createHash } from "crypto";

export interface ComplianceLogEntry {
  event: string;
  timestamp: string;
  country: string;
  entity_type: string;
  identifier_hash: string; // SHA-256 of identifier — not reversible
  verified: boolean;
  risk_score: string;
  aml_clear: boolean;
  sanctions_clear: boolean;
  pep_clear: boolean;
  world_nullifier: string; // nullifier_hash from World ID — not linked to real identity
  payment_tx?: string;
  error?: string;
}

function hashIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex").slice(0, 16);
}

export function logKycEvent(
  params: Omit<ComplianceLogEntry, "timestamp" | "identifier_hash"> & {
    raw_identifier: string;
  }
): void {
  const { raw_identifier, ...rest } = params;
  const entry: ComplianceLogEntry = {
    ...rest,
    timestamp: new Date().toISOString(),
    identifier_hash: hashIdentifier(raw_identifier),
  };

  // In production, ship to a SIEM / audit log store (e.g. AWS CloudWatch, Datadog)
  console.log(JSON.stringify({ type: "COMPLIANCE_AUDIT", ...entry }));
}

export function logKycError(params: {
  country: string;
  entity_type: string;
  raw_identifier: string;
  error: string;
  world_nullifier?: string;
}): void {
  const entry = {
    type: "COMPLIANCE_ERROR",
    timestamp: new Date().toISOString(),
    country: params.country,
    entity_type: params.entity_type,
    identifier_hash: hashIdentifier(params.raw_identifier),
    world_nullifier: params.world_nullifier ?? "unknown",
    error: params.error,
  };
  console.error(JSON.stringify(entry));
}
