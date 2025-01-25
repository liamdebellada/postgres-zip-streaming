import { createWriteStream } from "node:fs";

import client from "./db.ts";
import { createQuery } from "./query.ts";
import { streamDataToArchive } from "./archive.ts";

await client.connect();
console.log("Client connected.");

const query = createQuery(client);
const rowStream = query("SELECT * FROM generate_series(0, $1) num", [
  10_000,
]);

const fileStream = createWriteStream("./test.zip");
await streamDataToArchive(rowStream, fileStream);

client.end();
