/**
 * World AgentKit integration for verifying that an agent request is backed
 * by a real human World ID holder, preventing Sybil attacks.
 */

interface WorldProofPayload {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
}

interface MiniKitVerifyResponse {
  success: boolean;
  nullifier_hash?: string;
  error?: string;
}

function parseWorldProof(worldProof: string): WorldProofPayload {
  try {
    const decoded = Buffer.from(worldProof, "base64").toString("utf-8");
    return JSON.parse(decoded) as WorldProofPayload;
  } catch {
    throw new Error("Invalid world_proof format: expected base64-encoded JSON");
  }
}

async function verifyWithWorldcoinCloud(
  payload: WorldProofPayload,
  action: string,
  appId: string
): Promise<MiniKitVerifyResponse> {
  const endpoint = `https://developer.worldcoin.org/api/v2/verify/${appId}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merkle_root: payload.merkle_root,
      nullifier_hash: payload.nullifier_hash,
      proof: payload.proof,
      verification_level: payload.verification_level,
      action,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`World ID verification API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<MiniKitVerifyResponse>;
}

function isDevMode(): boolean {
  return process.env.NODE_ENV === "development" && process.env.WORLD_DEV_BYPASS === "true";
}

/**
 * Verifies the World ID proof attached to an agent request.
 * Returns the nullifier_hash (unique per human per action) on success,
 * which callers can use to detect duplicate submissions.
 */
export async function verifyWorldProof(worldProof: string): Promise<string> {
  if (isDevMode()) {
    console.warn("[WorldVerifier] Dev bypass enabled — skipping real World ID check");
    return "dev_nullifier_bypass";
  }

  const appId = process.env.WORLD_APP_ID;
  if (!appId) {
    throw new Error("WORLD_APP_ID environment variable is not set");
  }

  const action = process.env.WORLD_ACTION_ID ?? "kyc-verify";

  const payload = parseWorldProof(worldProof);

  const result = await verifyWithWorldcoinCloud(payload, action, appId);

  if (!result.success) {
    throw new Error(`World ID proof verification failed: ${result.error ?? "unknown error"}`);
  }

  return result.nullifier_hash ?? payload.nullifier_hash;
}
