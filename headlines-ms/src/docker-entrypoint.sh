#!/bin/sh

rabbitmq-server start
rabbitmqctl add_user admin admin123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
mongod --bind_ip_all