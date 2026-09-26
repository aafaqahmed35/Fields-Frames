import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import {
  buildRevalidationPlan,
  fetchRevalidationDependents,
  type RevalidationWebhookPayload,
} from "@/sanity/lib/revalidation";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  }

  let body: RevalidationWebhookPayload & { _id: string };

  try {
    const parsed = await parseBody<RevalidationWebhookPayload>(
      request,
      secret,
      false,
    );

    if (!parsed.isValidSignature) {
      return Response.json({ error: "Invalid signature." }, { status: 401 });
    }

    if (!parsed.body || typeof parsed.body._id !== "string") {
      throw new Error("Webhook payload requires a document ID.");
    }

    buildRevalidationPlan(parsed.body);
    body = { ...parsed.body, _id: parsed.body._id };
  } catch (error) {
    console.error(
      "Sanity revalidation webhook rejected:",
      error instanceof Error ? error.message : error,
    );
    return Response.json({ error: "Invalid webhook payload." }, { status: 400 });
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
  } catch (error) {
    console.error(
      "Sanity revalidation failed:",
      error instanceof Error ? error.message : error,
    );
    return Response.json(
      { error: "Revalidation dependency lookup failed." },
      { status: 502 },
    );
  }
}
