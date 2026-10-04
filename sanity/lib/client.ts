import { createClient } from "next-sanity";

import { requirePublicSanityConfig, sanityApiVersion } from "../env";

// The SDK's native-fetch transport does not enforce its timeout option.
// Apply a real deadline to every fetch, including preview-secret validation
// and withConfig clones, while retaining the SDK's caching and retry options.
function withDeadline(
  client: ReturnType<typeof createClient>,
): ReturnType<typeof createClient> {
  const bounded = client.clone();
  Object.defineProperty(bounded, "fetch", {
    value: (...args: Parameters<typeof client.fetch>) => {
      const deadline = AbortSignal.timeout(10_000);
      const signal = args[2]?.signal
        ? AbortSignal.any([args[2].signal, deadline])
        : deadline;
      return client.fetch(args[0], args[1], { ...args[2], signal });
    },
    writable: true,
  });
  bounded.withConfig = (config) => withDeadline(client.withConfig(config));
  return bounded;
}

let configuredClient: ReturnType<typeof createClient> | undefined;

export function getSanityClient() {
  if (!configuredClient) {
    const { projectId, dataset } = requirePublicSanityConfig();

    configuredClient = withDeadline(
      createClient({
        projectId,
        dataset,
        apiVersion: sanityApiVersion,
        perspective: "published",
        stega: false,
        useCdn: true,
        timeout: 10_000,
        maxRetries: 1,
      }),
    );
  }

  return configuredClient;
}
