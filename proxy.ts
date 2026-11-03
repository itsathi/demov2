import { NextResponse, type NextRequest } from "next/server";
import {
  adminChallengeHeaders,
  isAdminAuthorized,
  isAdminConfigured,
} from "./lib/adminAuth";

/**
 * Protect the admin demo registry and its export endpoint. The export route
 * repeats this check so the CSV can never be fetched by bypassing the proxy.
 */
export function proxy(request: NextRequest) {
  if (!isAdminConfigured()) {
    return new NextResponse(
      "Demo registry export is disabled. Set DEMO_EXPORT_PASSWORD to enable it.\n",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  if (!isAdminAuthorized(request.headers.get("authorization"))) {
    return new NextResponse("Authentication required.\n", {
      status: 401,
      headers: {
        ...adminChallengeHeaders(),
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
