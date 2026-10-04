import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { readSignedWebhook, WebhookRequestError } from "@/lib/webhook";

import {
  buildRevalidationPlan,
  fetchRevalidationDependents,
  type RevalidationWebhookPayload,
} from "@/sanity/lib/revalidation";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    console.error("[webhook.config] missing signing secret");
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  }

  let body: RevalidationWebhookPayload & { _id: string };

  try {
    const parsed = await readSignedWebhook(request, secret);
    buildRevalidationPlan(parsed);
    body = parsed as RevalidationWebhookPayload & { _id: string };
  } catch (error) {
    const status = error instanceof WebhookRequestError ? error.status : 400;
    console.warn("[webhook.reject]", { status });
    return Response.json(
      {
        error:
          error instanceof WebhookRequestError
            ? error.message
            : "Invalid webhook payload.",
      },
      { status },
    );
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 3_000));

    const dependents = await fetchRevalidationDependents(body._id);
    const plan = buildRevalidationPlan({ ...body, dependents });
    for (const tag of plan.tags) {
      revalidateTag(tag, { expire: 0 });
    }
    for (const path of plan.paths) {
      revalidatePath(path);
    }

    return Response.json({
      revalidated: true,
      documentType: plan.documentType,
      paths: plan.paths,
    });
  } catch {
    console.error("[webhook.revalidate] failed", { documentType: body._type });
    return Response.json(
      { error: "Revalidation dependency lookup failed." },
      { status: 502 },
    );
  }
}
