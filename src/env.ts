import { z } from "zod";

export default z.object({
  PG_CONNECTION_STRING: z.string().min(1),
}).parse(Deno.env.toObject());
