#!/bin/sh

rabbitmq-server start &
mongod --bind_ip_all &
touch /sample.txt &
eval touch /sample2.txt &
rabbitmqctl add_user admin admin123;
rabbitmqctl set_user_tags admin administrator;
rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*";
# rabbitmqctl add_user admin admin123 ; \
# rabbitmqctl set_user_tags admin administrator ; \
# rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*" ; \
