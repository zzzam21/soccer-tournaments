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

echo "Starting server..."
exec gunicorn django_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --reload
