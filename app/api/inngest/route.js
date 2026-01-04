export const runtime = "nodejs";

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
} from "@/inngest/functions";

// ---- Inngest handler (normal) ----
const inngestHandler = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
  ],
});

// ---- Unified POST handler ----
export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";

  // ✅ CLERK WEBHOOK REQUEST
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();

      // Only forward user events
      if (body?.type?.startsWith("user.")) {
        await inngest.send({
          name: body.type, // user.created | user.updated | user.deleted
          data: body.data,
        });
      }

      // ALWAYS return 200 to Clerk
      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("Webhook error:", err);
      return new Response("OK", { status: 200 });
    }
  }

  // ✅ INNGEST CLOUD REQUEST
  return inngestHandler.POST(req);
}

// Required exports for Inngest
export const GET = inngestHandler.GET;
export const PUT = inngestHandler.PUT;
