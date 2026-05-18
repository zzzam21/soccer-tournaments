#!/bin/sh
set -e

bash /app/scripts/prestart.sh

echo "Starting server..."
exec gunicorn django_project.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --reload
