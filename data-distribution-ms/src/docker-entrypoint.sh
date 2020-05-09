#!/bin/sh

rabbitmq-server start &
celery worker -A fetch_headlines --loglevel=info -f /app/celery-beat-logs/worker.log &
celery -A fetch_headlines beat --loglevel=info -f /app/celery-beat-logs/beat.log &
mongod --bind_ip_all
