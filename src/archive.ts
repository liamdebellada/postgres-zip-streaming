import type { Buffer } from "node:buffer";
import { WriteStream } from "node:fs";

// @deno-types="@types/archiver"
import archiver, { Archiver } from "archiver";
import type QueryStream from "pg-query-stream";

import env from "./env.ts";

type ArchiveWithQueue = {
  _queue: {
    length: () => number;
    drain: () => Promise<void>;
  };
} & Archiver;

export const streamDataToArchive = async (
  dataStream: QueryStream,
  writeStream: WriteStream,
  parseRow: (row: unknown[]) => readonly [Buffer, string],
) => {
  const archive = archiver("zip");
  archive.pipe(writeStream);

  const cleanupPromise = new Promise<void>((resolve) => {
    dataStream.on("end", () => {
      archive.finalize();
      resolve();
    });
  });

  for await (const row of dataStream) {
    const [buffer, name] = parseRow(row);

    const { _queue } = archive.append(
      buffer,
      { name },
    ) as ArchiveWithQueue;

    if (_queue.length() > env.MAX_ARCHIVE_QUEUE_LEN) {
      await _queue.drain();
    }
  }

  return cleanupPromise;
};
