# Stream Postgres rows into a writeable stream as zip

## About

This project implements the logic required to stream postgres rows from a large query directly into a writeable stream.
The stream could be used in a web server, or just to write to a file (as per this example).

## Running locally

> Note: For this example you need a postgres database running.

```bash
docker build -t pg-stream . && \
docker run --net=host \
-v ./:/app/archives \
-e PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/ \
-e MAX_ARCHIVE_QUEUE_LEN=100 \
-e ZIP_OUTPUT_DIR=./archives \
deno-comp
```
