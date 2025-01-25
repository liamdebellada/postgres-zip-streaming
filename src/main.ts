import { createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import * as fs from "node:fs";

// @deno-types="@types/archiver"
import archiver from "archiver";

import client from "./db.ts";
import { createQuery } from "./query.ts";

// const formatRow = new Transform({
//   transform(chunk, encoding, callback) {
//     callback(null, chunk[0].toString());
//   },
//   objectMode: true,
// });

await client.connect();
console.log("Client connected.");

const exampleXML = fs.readFileSync("./test.xml");

const zfile = archiver("zip");

const query = createQuery(client);
const rowStream = query("SELECT * FROM generate_series(0, $1) num", [
  1_000_000,
]);

const fileStream = createWriteStream("./test.zip");

zfile.pipe(fileStream);

for await (const [row] of rowStream) {
  const { _queue } = zfile.append(
    exampleXML,
    { name: row.toString() },
  );

  if (_queue.length() > 20) {
    await _queue.drain();
  }
}

rowStream.on("end", () => zfile.finalize());
