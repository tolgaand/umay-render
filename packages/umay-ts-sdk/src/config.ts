import { z } from "zod";

const EnvSchema = z.object({
  API_URL: z
    .string()
    .url()
    .default("https://umay-api-935360498495.us-central1.run.app/v1"),
  TIMEOUT: z.coerce.number().default(30_000),
});

export type UmayConfig = z.infer<typeof EnvSchema>;

export function loadConfig(
  env: Record<string, string | undefined> = process.env
): UmayConfig {
  const parsed = EnvSchema.parse({
    API_URL: env.API_URL,
    TIMEOUT: env.TIMEOUT,
  });
  return parsed;
}
