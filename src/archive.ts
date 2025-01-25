import { WriteStream } from "node:fs";

// @deno-types="@types/archiver"
import archiver, { Archiver } from "archiver";
import type QueryStream from "pg-query-stream";

import env from "./env.ts";

// TODO: remove
import fs from "node:fs";
const exampleXML = fs.readFileSync("./test.xml");

type ArchiveWithQueue = {
  _queue: {
    length: () => number;
    drain: () => Promise<void>;
  };
} & Archiver;

export const streamDataToArchive = async (
  dataStream: QueryStream,
  writeStream: WriteStream,
) => {
  const archive = archiver("zip");
  archive.pipe(writeStream);

  const cleanupPromise = new Promise<void>((resolve) => {
    dataStream.on("end", () => {
      archive.finalize();
      resolve();
    });
  });

  for await (const [row] of dataStream) {
    const { _queue } = archive.append(
      exampleXML,
      { name: row.toString() },
    ) as ArchiveWithQueue;

    if (_queue.length() > env.MAX_ARCHIVE_QUEUE_LEN) {
      await _queue.drain();
    }
  }

  return cleanupPromise;
};
