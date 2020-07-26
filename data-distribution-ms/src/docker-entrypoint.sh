#!/bin/sh

rabbitmq-server start &
supervisord --configuration=/app/src/celery_dd_tasks/supervisord.conf --directory=/app/src/celery_dd_tasks  --logfile=/app/src/celery_dd_tasks/supervisord.log --loglevel=trace
echo "supervisord ran successfully"
mongod --bind_ip_all
