import { orgRoute } from "@/lib/zod-route";
import { z } from "zod";

export const POST = orgRoute
  .params(
    z.object({
      orgId: z.string(),
    }),
  )
  .metadata({
    permissions: {
      users: ["create"],
    },
  })
  .body(z.object({ name: z.string() }))
  .handler(async () => {
    return {
      hello: "world",
    };
  });
