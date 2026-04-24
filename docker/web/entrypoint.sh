#!/bin/sh
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [ -z "${SECRET_KEY_BASE}" ]; then
  echo "SECRET_KEY_BASE is required" >&2
  exit 1
fi

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
user="${POSTGRES_USER:-wallet}"
db="${POSTGRES_DB:-wallet_app_production}"
export PGPASSWORD="${POSTGRES_PASSWORD:-wallet_challenge_dev}"

until pg_isready -h "$host" -p "$port" -U "$user" -d "$db" >/dev/null 2>&1; do
  echo "Waiting for PostgreSQL at ${host}:${port} (db=${db})..."
  sleep 2
done

bundle exec rails db:prepare

exec "$@"
