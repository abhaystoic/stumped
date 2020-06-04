#!/bin/sh

rabbitmq-server start &
sleep 120 &
celery worker -A celery_dd_tasks.headlines.fetch_headlines --loglevel=info -f /app/celery-beat-logs/worker.log &
celery -A celery_dd_tasks.headlines.fetch_headlines beat --loglevel=info -f /app/celery-beat-logs/beat.log &
celery worker -A celery_dd_tasks.covid19.fetch_covid19_news --loglevel=info -f /app/celery-beat-logs/worker.log &
celery -A celery_dd_tasks.covid19.fetch_covid19_news beat --loglevel=info -f /app/celery-beat-logs/beat.log &
celery worker -A celery_dd_tasks.all_news.fetch_all_news --loglevel=info -f /app/celery-beat-logs/worker.log &
celery -A celery_dd_tasks.all_news.fetch_all_news beat --loglevel=info -f /app/celery-beat-logs/beat.log &
mongod --bind_ip_all
