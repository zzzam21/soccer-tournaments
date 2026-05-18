#!/bin/sh
set -e

echo "Waiting for postgres..."
until python -c "
import psycopg2
from decouple import config
psycopg2.connect(
    dbname=config('DB_NAME'),
    user=config('DB_USER'),
    password=config('DB_PASSWORD'),
    host=config('DB_HOST'),
    port=config('DB_PORT')
).close()
" 2>/dev/null; do
  echo "  DB not ready, retrying in 2s..."
  sleep 2
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating initial data..."
python initial_data.py

echo "Clearing cache..."
python clear_cache.py
