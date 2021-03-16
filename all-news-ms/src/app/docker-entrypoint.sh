#!/bin/sh

mongod --bind_ip_all &
rabbitmq-server start &

# TODO: Create separate config file for gunicorn.
gunicorn --bind 0.0.0.0:5000 wsgi:app --access-logfile /flask_app/src/app/gunicorn_access.log --log-level debug --error-logfile /flask_app/src/app/gunicorn_error.log --capture-output &

echo "Starting supervisord..."
supervisord --configuration=/flask_app/src/app/supervisord.conf --directory=/flask_app/src/app  --logfile=/flask_app/src/app/supervisord.log --loglevel=trace &
echo "supervisord scheduled the tasks succesfully"

# Sleeping, so that rabbitmq-server starts properly.
(sleep 30;
rabbitmqctl add_user admin admin123 2>/dev/null ; \
rabbitmqctl add_vhost allnewsvhost; \
rabbitmqctl set_user_tags admin administrator ; \
rabbitmqctl set_permissions -p allnewsvhost admin  ".*" ".*" ".*" ; \
echo "User 'admin' has been created") & rabbitmq-server
