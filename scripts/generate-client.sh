#!/bin/bash
set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
OUTPUT_DIR="frontend/src/client"

echo "Downloading API schema from $BACKEND_URL/api/schema/..."
curl -s "$BACKEND_URL/api/schema/?format=yaml" -o frontend/swagger.json

echo "Generating Angular client..."
cd frontend
npx ng-openapi --config openapi.config.ts

echo "Client generated at $OUTPUT_DIR"
