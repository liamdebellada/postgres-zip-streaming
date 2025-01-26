import process from "node:process";
import { Buffer } from "node:buffer";
import { Writable } from "node:stream";

import env from "./env.ts";
import client from "./db.ts";
import { createQuery } from "./query.ts";
import { streamDataToArchive } from "./archive.ts";

await client.connect();
console.log("Client connected");

const query = createQuery(client);

const server = Deno.serve(() => {
  const rowStream = query("SELECT * FROM generate_series(0, $1) num", [
    env.EXAMPLE_PG_ROWS,
  ]);

  const parseRow = (row: unknown[]) =>
    [
      Buffer.from(row[0]!.toString()),
      row.toString(),
    ] as const;

  const transformStream = new TransformStream();

  streamDataToArchive(
    rowStream,
    Writable.fromWeb(transformStream.writable),
    parseRow,
  );

  return new Response(transformStream.readable, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="example.zip"',
    },
  });
});

process.on("SIGTERM", async () => {
  await server.shutdown();
  client.end();
});
