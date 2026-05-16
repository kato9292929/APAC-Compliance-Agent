import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global middleware.
 *
 * Payment gating is handled per-route via withX402 wrappers in each
 * route file, so this middleware only enforces non-payment-related concerns:
 * - Rate limiting headers are set upstream (e.g. by Vercel / Cloudflare)
 * - CORS is handled here for preflight requests
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN ?? "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, X-PAYMENT, X-Payment, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
