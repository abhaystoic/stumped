#!/bin/sh

mongod --bind_ip_all &
rabbitmq-server start &
# Sleeping, so that rabbitmq-server starts properly.
(sleep 30;
rabbitmqctl add_user admin admin123 2>/dev/null ; \
rabbitmqctl set_user_tags admin administrator ; \
rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*" ; \
echo "User 'admin' has been created") & rabbitmq-server
