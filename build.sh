#!/bin/bash

cd frontend || exit
bun install --frozen-lockfile
bun run build

cd ..
go build -o build/server main.go