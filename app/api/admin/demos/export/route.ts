import { allProspects } from "@/lib/prospect";
import { buildDemoExport, resolveDemoBaseUrl } from "@/lib/demoExport";
import {
  adminChallengeHeaders,
  isAdminAuthorized,
  isAdminConfigured,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function unauthorizedResponse(): Response {
  return new Response("Authentication required.\n", {
    status: 401,
    headers: {
      ...adminChallengeHeaders(),
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function GET(request: Request) {
  if (!isAdminConfigured()) {
    return new Response(
      "Demo registry export is disabled. Set DEMO_EXPORT_PASSWORD to enable it.\n",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  if (!isAdminAuthorized(request.headers.get("authorization"))) {
    return unauthorizedResponse();
  }

  const baseUrl = resolveDemoBaseUrl(request.headers);
  const { csv } = buildDemoExport(allProspects, { baseUrl });
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="athinem-demo-registry-${date}.csv"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
