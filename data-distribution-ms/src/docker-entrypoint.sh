#!/bin/sh

rabbitmq-server start &
supervisord --configuration=/app/src/celery_dd_tasks/supervisord.conf --directory=/app/src/celery_dd_tasks  --logfile=/app/src/celery_dd_tasks/supervisord.log --loglevel=trace &
echo "supervisord ran successfully"
# celery worker -A celery_dd_tasks.headlines.fetch_headlines --loglevel=info -f /app/celery-beat-logs/headlines-worker.log &
# sleep 120 &
# celery -A celery_dd_tasks.headlines.fetch_headlines beat --loglevel=info --pidfile=celery_dd_tasks/headlines/celerybeat.pid -f /app/celery-beat-logs/headlines-beat.log &
# sleep 120 &
# celery worker -A celery_dd_tasks.covid19.fetch_covid19_news --loglevel=info -f /app/celery-beat-logs/covid19-worker.log &
# sleep 120 &
# celery -A celery_dd_tasks.covid19.fetch_covid19_news beat --loglevel=info --pidfile=celery_dd_tasks/covid19/celerybeat.pid -f /app/celery-beat-logs/covid19-beat.log &
# sleep 120 &
# celery worker -A celery_dd_tasks.all_news.fetch_all_news --loglevel=info  -f /app/celery-beat-logs/all-news-worker.log &
# sleep 120 &
# celery -A celery_dd_tasks.all_news.fetch_all_news beat --loglevel=info --pidfile=celery_dd_tasks/all_news/celerybeat.pid -f /app/celery-beat-logs/all-news-beat.log &
# sleep 120 &
mongod --bind_ip_all
