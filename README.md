# Stream Postgres Rows into a Writable Zip Stream

## About

This project implements the logic required to stream Postgres rows from a large
query directly into a writable stream. The stream can be used in a web server or
to pipe directly to another stream (uploading to S3 for example).

## Running Locally

> **Note**: For this example, you need a running Postgres database.

1. Start the app

```bash
docker build -t pg-stream . && \
docker run --net=host \
-p 8000:8000 \
-e PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/ \
-e MAX_ARCHIVE_QUEUE_LEN=100 \
-e EXAMPLE_PG_ROWS=1000000 \
pg-stream
```

2. Then make a request like:

```bash
curl localhost:8000/example.zip --output example.zip
```

3. Check the zip contents:

```bash
unzip -l example.zip
```
