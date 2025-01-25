import { type Client } from "pg";
import QueryStream from "pg-query-stream";

export const createQuery =
  (client: Client) => (sql: string, values?: any[]) => {
    const query = new QueryStream(sql, values, { rowMode: "array" });
    return client.query(query) as QueryStream;
  };
