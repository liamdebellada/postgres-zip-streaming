FROM denoland/deno:2.1.6 AS build

WORKDIR /app

COPY . .

RUN deno install
RUN deno compile -A --output ./server ./src/main.ts

FROM gcr.io/distroless/cc:nonroot

WORKDIR /app

COPY --from=build /app/server /app/server

EXPOSE 8000

CMD ["/app/server"]
