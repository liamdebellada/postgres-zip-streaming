// @deno-types="@types/pg"
import pg from "pg";
import env from "./env.ts";

const client = new pg.Client({
  connectionString: env.PG_CONNECTION_STRING,
});

export default client;
