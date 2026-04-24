#!/bin/sh
set -e

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
user="${POSTGRES_USER:-wallet}"
db="${CI_DATABASE_NAME:-wallet_app_test}"
export PGPASSWORD="${POSTGRES_PASSWORD:-wallet_challenge_dev}"

until pg_isready -h "$host" -p "$port" -U "$user" -d "$db" >/dev/null 2>&1; do
  sleep 2
done

bundle exec rails db:test:prepare

exec "$@"
