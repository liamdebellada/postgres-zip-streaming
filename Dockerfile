FROM denoland/deno:2.1.6 AS build

WORKDIR /app

COPY . .

RUN deno install
RUN deno compile -A --output ./process ./src/main.ts

FROM gcr.io/distroless/cc:nonroot

WORKDIR /app

COPY --from=build /app/process /app/process

CMD ["/app/process"]
