// @deno-types="@types/pg"
import { type Client } from "pg";
import QueryStream from "pg-query-stream";

export const createQuery =
  (client: Client) => <T>(sql: string, values?: T[]) => {
    const query = new QueryStream(sql, values, { rowMode: "array" });
    return client.query(query) as QueryStream;
  };
