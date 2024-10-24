import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  EWELINK_ACCOUNT: z.string(),
  EWELINK_PASSWORD: z.string(),
  EWELINK_AREA: z.string(),
});

export default envSchema;
export type Env = z.infer<typeof envSchema>;
