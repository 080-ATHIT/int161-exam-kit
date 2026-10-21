#!/bin/sh
# Run with `sh requests/curl.sh`; only deletes the row this run created.
set -eu
base=${BASE_URL:-http://127.0.0.1:3000/api/demo001}
sku="CURL-$(date +%s)-$$"
id=''
cleanup() { if [ -n "$id" ]; then curl --fail --silent --show-error -X DELETE "$base/products/$id" > /dev/null || true; fi; }
trap cleanup EXIT HUP INT TERM
curl --fail --silent --show-error "$base/student-info"
curl --fail --silent --show-error "$base/products?page=1&limit=10"
created=$(curl --fail --silent --show-error -X POST "$base/products" -H 'Content-Type: application/json' --data "{\"sku\":\"$sku\",\"name\":\"Curl Phone\",\"brand_id\":1,\"category\":\"PHONE\",\"price\":10.50,\"ram_gb\":8,\"storage_gb\":128,\"color\":\"Black\"}")
id=$(printf '%s' "$created" | node --input-type=module -e 'let s="";for await(const c of process.stdin)s+=c;const id=JSON.parse(s).data?.id;if(!Number.isSafeInteger(id)||id<1)process.exit(1);process.stdout.write(String(id));')
curl --fail --silent --show-error "$base/products/$id"
curl --fail --silent --show-error -X PUT "$base/products/$id" -H 'Content-Type: application/json' --data "{\"sku\":\"$sku\",\"name\":\"Updated Curl Phone\",\"brand_id\":1,\"category\":\"PHONE\",\"price\":0,\"ram_gb\":8,\"storage_gb\":128,\"color\":\"Black\"}"
status=$(curl --silent --show-error -o /dev/null -w '%{http_code}' -X DELETE "$base/products/$id")
[ "$status" = 204 ] || { echo "Expected DELETE204; got $status" >&2; exit 1; }
id=''
echo ' CRUD smoke passed'
