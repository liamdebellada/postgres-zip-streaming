import process from "node:process";
import { Buffer } from "node:buffer";

import { z } from "zod";

import env from "./env.ts";
import client from "./db.ts";
import { createQuery } from "./query.ts";
import { streamDataToArchive } from "./archive.ts";

await client.connect();
console.log("Client connected");

const query = createQuery(client);

const server = Deno.serve((request) => {
  const patternResult = new URLPattern({ pathname: "/:fileName" }).exec(
    request.url,
  );

  if (!patternResult) {
    return new Response("Invalid Request", { status: 400 });
  }

  const fileName = z.string().min(1).endsWith(".zip").parse(
    patternResult.pathname.groups.fileName,
  );

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
    transformStream.writable,
    parseRow,
  );

  return new Response(transformStream.readable, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
});

process.on("SIGTERM", async () => {
  await server.shutdown();
  client.end();
});
