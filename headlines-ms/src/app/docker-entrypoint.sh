#!/bin/sh

mongod --bind_ip_all &
rabbitmq-server start &
gunicorn --bind 0.0.0.0:5000 wsgi:app &
# Sleeping, so that rabbitmq-server starts properly.
(sleep 30;
rabbitmqctl add_user admin admin123 2>/dev/null ; \
rabbitmqctl add_vhost headlinesvhost;
rabbitmqctl set_user_tags admin administrator ; \
rabbitmqctl set_permissions -p headlinesvhost admin  ".*" ".*" ".*" ; \
echo "User 'admin' has been created") & rabbitmq-server

supervisord --configuration=/flask_app/src/app/supervisord.conf --directory=/flask_app/src/app  --logfile=/flask_app/src/app/supervisord.log --loglevel=trace
echo "supervisord scheduled the tasks succesfully"
