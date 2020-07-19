#!/bin/sh

rabbitmq-server start &
sleep 120 &
celery worker -A celery_dd_tasks.headlines.fetch_headlines --loglevel=info -f /app/celery-beat-logs/headlines-worker.log &
celery -A celery_dd_tasks.headlines.fetch_headlines beat --loglevel=info --pidfile=celery_dd_tasks/headlines/celerybeat.pid -f /app/celery-beat-logs/headlines-beat.log &
celery worker -A celery_dd_tasks.covid19.fetch_covid19_news --loglevel=info -f /app/celery-beat-logs/covid19-worker.log &
celery -A celery_dd_tasks.covid19.fetch_covid19_news beat --loglevel=info --pidfile=celery_dd_tasks/covid19/celerybeat.pid -f /app/celery-beat-logs/covid19-beat.log &
celery worker -A celery_dd_tasks.all_news.fetch_all_news --loglevel=info  -f /app/celery-beat-logs/all-news-worker.log &
celery -A celery_dd_tasks.all_news.fetch_all_news beat --loglevel=info --pidfile=celery_dd_tasks/all_news/celerybeat.pid -f /app/celery-beat-logs/all-news-beat.log &
mongod --bind_ip_all
