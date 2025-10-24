FROM docker.io/alpine:latest

RUN mkdir /config
COPY build/server /app/server

EXPOSE 8080
VOLUME /config

ENTRYPOINT [ "/app/server", "serve", "--http", ":8080", "--data", "/config" ]