#!/bin/sh

rabbitmq-server start &
( sleep 10 ; \
rabbitmqctl add_user admin admin123 ; \
rabbitmqctl set_user_tags admin administrator ; \
rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*" ; \
echo "*** User 'admin' with admin123 'admin123' completed. ***" ; \
echo "*** Log in the WebUI at port 15672 (example: http:/localhost:15672) ***") &
mongod --bind_ip_all
