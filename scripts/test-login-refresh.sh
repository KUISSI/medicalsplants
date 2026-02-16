#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:8080}
EMAIL="e2e+$(date +%s)@example.test"
PASSWORD="P@ssw0rd123"
PSEUDO="e2e_$(date +%s)"

printf "Registering user: %s\n" "${EMAIL}"
REGISTER_RESP=$(curl -s -X POST "${BASE_URL}/api/v1/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"confirmPassword\":\"${PASSWORD}\",\"pseudo\":\"${PSEUDO}\"}")

printf "Login\n"
LOGIN_RESP=$(curl -s -X POST "${BASE_URL}/api/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.refreshToken')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
  printf "Login failed: %s\n" "$LOGIN_RESP" >&2
  exit 2
fi

printf "Access token obtained (truncated): %s...\n" "${ACCESS_TOKEN:0:20}"

printf "Calling refresh with refresh token...\n"
REF_RESP=$(curl -s -X POST "${BASE_URL}/api/v1/auth/refresh" -H "Content-Type: application/json" -d "{\"refreshToken\":\"${REFRESH_TOKEN}\"}")

printf "Refresh response: %s\n" "$REF_RESP"

NEW_ACCESS=$(echo "$REF_RESP" | jq -r '.data.accessToken')
if [ -n "$NEW_ACCESS" ] && [ "$NEW_ACCESS" != "null" ]; then
  printf "Refresh succeeded: new access token obtained (truncated): %s...\n" "${NEW_ACCESS:0:20}"
  exit 0
else
  printf "Refresh failed: %s\n" "$REF_RESP" >&2
  exit 3
fi
