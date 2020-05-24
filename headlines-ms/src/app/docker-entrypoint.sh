#!/bin/sh

mongod --bind_ip_all &
rabbitmq-server start &
gunicorn --bind 0.0.0.0:5000 wsgi:app &
# Sleeping, so that rabbitmq-server starts properly.
(sleep 30;
rabbitmqctl add_user admin admin123 2>/dev/null ; \
rabbitmqctl set_user_tags admin administrator ; \
rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*" ; \
echo "User 'admin' has been created") & rabbitmq-server

# python3 -u /flask_app/src/messaging/rabbit_receiver.py > output.log &
