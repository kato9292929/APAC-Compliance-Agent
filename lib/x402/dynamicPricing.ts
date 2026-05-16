import type { NextRequest } from "next/server";
import type { RouteConfig } from "x402/types";
import type { Country } from "./pricing";
import { getPriceLabel } from "./pricing";

// USDC contract address on Base mainnet
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const TIER_PRICES: Record<string, string> = {
  JP: "$1",
  SG: "$1",
  HK: "$1",
  AU: "$1.5",
  KR: "$1.5",
};

const MULTI_COUNTRY_PRICE = "$3";

/**
 * Reads the country from a cloned request body (leaving the original body intact)
 * and returns the appropriate x402 RouteConfig for dynamic pricing.
 */
export async function buildDynamicRouteConfig(
  req: NextRequest
): Promise<RouteConfig> {
  const isTestnet = process.env.NEXT_PUBLIC_NETWORK === "base-sepolia";
  const network = isTestnet ? "base-sepolia" : "base";
  const asset = isTestnet
    ? "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // USDC on base-sepolia
    : USDC_BASE;

  let country: Country | undefined;
  let countries: Country[] = [];

  try {
    const clone = req.clone();
    const body = await clone.json();
    country = body?.country as Country | undefined;
    // Support future multi-country array extension
    if (Array.isArray(body?.countries)) {
      countries = body.countries as Country[];
    } else if (country) {
      countries = [country];
    }
  } catch {
    // Malformed body — will fail schema validation in handler; use max price
  }

  const isMulti = countries.length > 1;
  const priceString = isMulti
    ? MULTI_COUNTRY_PRICE
    : country
    ? (TIER_PRICES[country] ?? "$1.5")
    : "$3";

  const label = countries.length
    ? getPriceLabel(countries)
    : "KYC Verification Fee";

  return {
    price: priceString,
    network,
    config: {
      description: `APAC KYC Verification — ${label}`,
      resource: req.url,
    },
  } as RouteConfig;
}
