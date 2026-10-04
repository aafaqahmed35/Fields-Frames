import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export class WebhookRequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Bound actual bytes, including chunked bodies, before JSON parsing. */
export async function readSignedWebhook(
  request: Request,
  secret: string,
): Promise<unknown> {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || signature.length > 512)
    throw new WebhookRequestError(401, "Invalid signature.");
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") ?? "",
    )
  ) {
    throw new WebhookRequestError(415, "Expected JSON.");
  }
  const limit = 16 * 1024;
  if (Number(request.headers.get("content-length")) > limit)
    throw new WebhookRequestError(413, "Payload too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new WebhookRequestError(400, "Invalid webhook payload.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new WebhookRequestError(413, "Payload too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  const body = new TextDecoder().decode(bytes);
  let valid = false;
  try {
    valid = await isValidSignature(body, signature, secret);
  } catch {
    /* malformed signature */
  }
  if (!valid) throw new WebhookRequestError(401, "Invalid signature.");
  try {
    return JSON.parse(body);
  } catch {
    throw new WebhookRequestError(400, "Invalid webhook payload.");
  }
}
