#!/bin/sh

rabbitmq-server start &
celery worker -A fetch_headlines --loglevel=info &
celery -A fetch_headlines beat --loglevel=info -s /app/celery-beat-logs/  &
mongod --bind_ip_all
