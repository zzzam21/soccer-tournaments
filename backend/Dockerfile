FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    libpq-dev gcc dos2unix \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN dos2unix /app/entrypoint.sh /app/scripts/prestart.sh /app/scripts/start.sh \
    && chmod +x /app/entrypoint.sh /app/scripts/prestart.sh /app/scripts/start.sh

EXPOSE 8000

CMD ["bash", "/app/scripts/start.sh"]
