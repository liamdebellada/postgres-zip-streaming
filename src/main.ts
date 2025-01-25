import { Buffer } from "node:buffer";
import { createWriteStream, existsSync, mkdirSync } from "node:fs";

import env from "./env.ts";
import client from "./db.ts";
import { createQuery } from "./query.ts";
import { streamDataToArchive } from "./archive.ts";

await client.connect();
console.log("Client connected");

const query = createQuery(client);
const rowStream = query("SELECT * FROM generate_series(0, $1) num", [
  env.EXAMPLE_PG_ROWS,
]);

const parseRow = (row: unknown[]) =>
  [
    Buffer.from(row[0]!.toString()),
    row.toString(),
  ] as const;

if (!existsSync(env.ZIP_OUTPUT_DIR)) mkdirSync(env.ZIP_OUTPUT_DIR);

// Example stream, could be any writeable stream.
const fileStream = createWriteStream(`${env.ZIP_OUTPUT_DIR}/output.zip`);
await streamDataToArchive(rowStream, fileStream, parseRow);

client.end();
