import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { KycRequestSchema } from "../../../../lib/kyc/types";
import { verifyWorldProof } from "../../../../lib/kyc/worldVerifier";
import { runKycVerification } from "../../../../lib/kyc/verifier";
import { buildDynamicRouteConfig } from "../../../../lib/x402/dynamicPricing";
import { logKycEvent, logKycError } from "../../../../lib/compliance/logger";

const PAY_TO = (process.env.PAYMENT_RECEIVE_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

async function kycHandler(request: NextRequest): Promise<NextResponse> {
  let worldNullifier = "unknown";
  let rawIdentifier = "";
  let rawCountry = "";
  let rawEntityType = "";

  try {
    const body = await request.json();

    const parsed = KycRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const req = parsed.data;
    rawIdentifier = req.identifier;
    rawCountry = req.country;
    rawEntityType = req.entity_type;

    // Step 1: Verify World ID proof (human-backed agent check)
    try {
      worldNullifier = await verifyWorldProof(req.world_proof);
    } catch (err) {
      logKycError({
        country: req.country,
        entity_type: req.entity_type,
        raw_identifier: req.identifier,
        error: `World ID verification failed: ${(err as Error).message}`,
        world_nullifier: "invalid",
      });
      return NextResponse.json(
        { error: "World ID verification failed", detail: (err as Error).message },
        { status: 403 }
      );
    }

    // Step 2: Run KYC + AML concurrently
    const result = await runKycVerification(req);

    // Step 3: Compliance audit log (no raw PII stored)
    logKycEvent({
      event: "KYC_VERIFY",
      country: req.country,
      entity_type: req.entity_type,
      raw_identifier: req.identifier,
      verified: result.verified,
      risk_score: result.risk_score,
      aml_clear: result.aml_clear,
      sanctions_clear: result.sanctions_clear,
      pep_clear: result.pep_clear,
      world_nullifier: worldNullifier,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    logKycError({
      country: rawCountry,
      entity_type: rawEntityType,
      raw_identifier: rawIdentifier,
      error: (err as Error).message,
      world_nullifier: worldNullifier,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Wrap the handler with x402 payment gate using dynamic per-country pricing
export const POST = withX402(kycHandler, PAY_TO, buildDynamicRouteConfig);
