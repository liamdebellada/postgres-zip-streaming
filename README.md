# Stream Postgres Rows into a Writable Stream as a Zip

## About

This project implements the logic required to stream Postgres rows from a large query directly into a writable stream.
The stream can be used in a web server or to write to a file (as shown in this example).

## Running Locally

> **Note**: For this example, you need a running Postgres database.

```bash
docker build -t pg-stream . && \
docker run --net=host \
-v $(pwd)/archives:/app/archives \
-e PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/ \
-e MAX_ARCHIVE_QUEUE_LEN=100 \
-e ZIP_OUTPUT_DIR=./archives \
-e EXAMPLE_PG_ROWS=1000000 \
pg-stream
```
