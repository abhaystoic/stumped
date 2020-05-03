#!/bin/sh

rabbitmq-server start &
mongod --bind_ip_all