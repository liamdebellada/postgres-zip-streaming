import { z } from "zod";

export default z.object({
  PG_CONNECTION_STRING: z.string().min(1),
  MAX_ARCHIVE_QUEUE_LEN: z.coerce.number().min(1),
  ZIP_OUTPUT_DIR: z.string().min(1),
}).parse(Deno.env.toObject());
