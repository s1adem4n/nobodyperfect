#!/bin/bash

cd frontend || exit
bun install --frozen-lockfile
bun run build

cd ..
CGO_ENABLED=0 go build -o build/server main.go