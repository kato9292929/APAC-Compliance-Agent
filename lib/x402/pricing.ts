/**
 * x402 dynamic pricing for KYC verification.
 *
 * Prices are denominated in USD and settled in USDC on Base.
 *
 * JP / SG / HK  →  $1.00 per check
 * AU / KR       →  $1.50 per check
 * Multi-country →  $3.00 (flat for combined lookups)
 */

export type Country = "JP" | "SG" | "HK" | "AU" | "KR";

const SINGLE_COUNTRY_PRICES: Record<Country, number> = {
  JP: 1.0,
  SG: 1.0,
  HK: 1.0,
  AU: 1.5,
  KR: 1.5,
};

const MULTI_COUNTRY_PRICE = 3.0;

/** Returns the USDC amount (in wei, 6 decimals) for the given countries. */
export function getPriceForCountries(countries: Country[]): bigint {
  const unique = Array.from(new Set(countries));
  const usdAmount =
    unique.length > 1 ? MULTI_COUNTRY_PRICE : SINGLE_COUNTRY_PRICES[unique[0]];

  // USDC on Base uses 6 decimal places
  return BigInt(Math.round(usdAmount * 1_000_000));
}

/** Human-readable price label for the payment response header. */
export function getPriceLabel(countries: Country[]): string {
  const unique = Array.from(new Set(countries));
  const usdAmount =
    unique.length > 1 ? MULTI_COUNTRY_PRICE : SINGLE_COUNTRY_PRICES[unique[0]];
  return `$${usdAmount.toFixed(2)} USDC`;
}
