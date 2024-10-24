import { z } from "zod";

const configSchema = z.object({
  sleep: z.number().int(),
  preserveState: z.boolean(),
  players: z.array(z.string()),
  devices: z.object({
    outlets: z.array(
      z.object({ id: z.string(), switches: z.number().int().optional() })
    ),
    dimmables: z.array(z.object({ id: z.string() })),
  }),
});

export default configSchema;
export type Config = z.infer<typeof configSchema>;
