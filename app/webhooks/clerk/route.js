import { headers } from "next/headers";
import { Webhook } from "svix";
import { inngest } from "@/inngest/client";

export async function POST(req) {
  const payload = await req.text();
  const headerList = headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  // 🔥 SEND EVENT TO INNGEST
  await inngest.send({
    name: type, // user.created | user.updated | user.deleted
    data,
  });

  return new Response("OK");
}
