import type { Buffer } from "node:buffer";

import * as zip from "@zip-js/zip-js";
import type QueryStream from "pg-query-stream";

export const streamDataToArchive = async (
  dataStream: QueryStream,
  writeStream: WritableStream,
  parseRow: (row: unknown[]) => readonly [Buffer, string],
) => {
  const zipWriter = new zip.ZipWriter(writeStream, { compressionMethod: 0 });

  for await (const row of dataStream) {
    const [buffer, name] = parseRow(row);

    await zipWriter.add(
      name,
      new Blob([buffer]).stream(),
    );

    await zip.terminateWorkers();
  }

  await zipWriter.close();
};
