# Stream Postgres Rows into a Writable Zip Stream

## About

This project implements the logic required to stream Postgres rows from a large
query directly into a writable zip stream. The zip stream could be piped to a response (like in this example), or piped
into something like S3.

## Running Locally

> **Note**: For this example, you need a running Postgres database.

1. Start the app

```bash
docker build -t pg-stream . && \
docker run --net=host \
-p 8000:8000 \
-e PG_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/ \
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
