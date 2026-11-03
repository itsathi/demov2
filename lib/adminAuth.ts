/**
 * Minimal administrator gate for the demo registry export.
 *
 * This application previously had no authentication layer. Rather than invent a
 * user database, the export is protected by HTTP Basic credentials supplied via
 * environment variables. The proxy performs the browser challenge; the export
 * route re-checks the same credentials so it cannot be bypassed directly.
 *
 * Required environment:
 *   DEMO_EXPORT_PASSWORD   (secret; export is disabled when unset)
 * Optional environment:
 *   DEMO_EXPORT_USERNAME   (defaults to "admin")
 */

export const ADMIN_AUTH_REALM = "Demo Registry";

const DEFAULT_USERNAME = "admin";

type AdminCredentials = { username: string; password: string };

export function getAdminCredentials(): AdminCredentials | null {
  const password = process.env.DEMO_EXPORT_PASSWORD;
  if (!password) return null;

  const username = process.env.DEMO_EXPORT_USERNAME?.trim() || DEFAULT_USERNAME;
  return { username, password };
}

export function isAdminConfigured(): boolean {
  return getAdminCredentials() !== null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Validate an incoming `Authorization: Basic ...` header. */
export function isAdminAuthorized(
  authorizationHeader: string | null | undefined
): boolean {
  const credentials = getAdminCredentials();
  if (!credentials) return false;

  if (!authorizationHeader?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(
      authorizationHeader.slice("Basic ".length).trim(),
      "base64"
    ).toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    return (
      safeEqual(username, credentials.username) &&
      safeEqual(password, credentials.password)
    );
  } catch {
    return false;
  }
}

export function adminChallengeHeaders(): Record<string, string> {
  return {
    "WWW-Authenticate": `Basic realm="${ADMIN_AUTH_REALM}", charset="UTF-8"`,
  };
}
