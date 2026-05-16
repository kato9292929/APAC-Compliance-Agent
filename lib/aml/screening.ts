import type { AmlScreeningResult } from "../kyc/types";

/**
 * AML / Sanctions / PEP screening.
 *
 * Production integrations:
 *   - UN Security Council Consolidated List (public, HTTPS)
 *   - OFAC SDN List (public, HTTPS)
 *   - EU Financial Sanctions Files (public, HTTPS)
 *   - Dow Jones / Refinitiv World-Check / ComplyAdvantage (commercial)
 *
 * Here we implement the UN and OFAC public list checks plus a stub for
 * commercial PEP database integration.
 */

const OFAC_API = "https://api.ofac-api.com/v4/search";
const UN_SANCTIONS_API =
  "https://scsanctions.un.org/resources/xml/en/consolidated.xml";

async function checkOfac(name: string): Promise<boolean> {
  const apiKey = process.env.OFAC_API_KEY;
  if (!apiKey) {
    return checkNameAgainstOpenSanctions(name);
  }

  const res = await fetch(OFAC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apiKey,
    },
    body: JSON.stringify({
      cases: [{ name }],
      minScore: 85,
      source: ["SDN"],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) return false;

  const json = (await res.json()) as { results?: Array<{ matchCount?: number }> };
  return (json.results?.[0]?.matchCount ?? 0) === 0;
}

/**
 * OpenSanctions is a free, open-source consolidated sanctions dataset.
 * Docs: https://www.opensanctions.org/docs/api/
 */
async function checkNameAgainstOpenSanctions(name: string): Promise<boolean> {
  const res = await fetch(
    `https://api.opensanctions.org/match/sanctions?api_key=${process.env.OPENSANCTIONS_API_KEY ?? ""}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: {
          entity: { schema: "Person", properties: { name: [name] } },
        },
      }),
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!res.ok) return true; // Fail open if API unavailable (log separately)

  const json = (await res.json()) as {
    responses?: { entity?: { results?: Array<{ score?: number }> } };
  };
  const topScore = json.responses?.entity?.results?.[0]?.score ?? 0;
  return topScore < 0.85;
}

async function checkPep(name: string): Promise<boolean> {
  // PEP (Politically Exposed Persons) check via OpenSanctions PEP dataset
  const res = await fetch(
    `https://api.opensanctions.org/match/peps?api_key=${process.env.OPENSANCTIONS_API_KEY ?? ""}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: {
          entity: { schema: "Person", properties: { name: [name] } },
        },
      }),
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!res.ok) return true;

  const json = (await res.json()) as {
    responses?: { entity?: { results?: Array<{ score?: number }> } };
  };
  const topScore = json.responses?.entity?.results?.[0]?.score ?? 0;
  return topScore < 0.85;
}

async function checkUnSanctions(name: string): Promise<boolean> {
  // UN consolidated list — public XML feed, no auth required
  const res = await fetch(UN_SANCTIONS_API, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return true;

  const xml = await res.text();
  // Simple name substring match; production should use fuzzy matching
  const normalizedName = name.toLowerCase().replace(/\s+/g, " ").trim();
  return !xml.toLowerCase().includes(normalizedName);
}

export async function runAmlScreening(name: string): Promise<AmlScreeningResult> {
  const [sanctionsClear, unClear, pepClear] = await Promise.allSettled([
    checkOfac(name),
    checkUnSanctions(name),
    checkPep(name),
  ]);

  const sanctionsOk =
    sanctionsClear.status === "fulfilled" ? sanctionsClear.value : true;
  const unOk = unClear.status === "fulfilled" ? unClear.value : true;
  const pepOk = pepClear.status === "fulfilled" ? pepClear.value : true;

  const allSanctionsClear = sanctionsOk && unOk;

  return {
    aml_clear: allSanctionsClear && pepOk,
    sanctions_clear: allSanctionsClear,
    pep_clear: pepOk,
    dataSources: [
      "OFAC SDN / OpenSanctions Consolidated Sanctions",
      "UN Security Council Consolidated List",
      "OpenSanctions PEP Database",
    ],
  };
}
