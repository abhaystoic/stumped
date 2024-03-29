#!/bin/sh

# Remove --nojournal when the system grows big.
mongod --bind_ip_all --port $MONGODB_PORT --nojournal &
sleep 10
echo "###########################################################################################################################"
echo "Creating app users..."
mongo admin --host localhost --port $MONGODB_PORT --eval "db.createUser({user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD',roles: ['root', 'userAdminAnyDatabase','userAdmin','readWrite','dbAdmin','clusterAdmin','readWriteAnyDatabase','dbAdminAnyDatabase']});"
echo "App users created..."
mongo admin --host localhost --port $MONGODB_PORT --eval "db.getSiblingDB('admin').shutdownServer()"
sleep 10
echo "---------------------------------------------------------------------------------------------"
echo "Starting mongo again with auth enabled..."
mongod --bind_ip_all --port $MONGODB_PORT --auth --nojournal &
sleep 10
mongo admin --host localhost --port $MONGODB_PORT --eval "db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PWD',roles: ['readWriteAnyDatabase']});" -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD
rabbitmq-server start &
# TODO: Create separate config file for gunicorn.
gunicorn --bind 0.0.0.0:5000 wsgi:app --access-logfile /flask_app/src/app/gunicorn_access.log --log-level debug --error-logfile /flask_app/src/app/gunicorn_error.log --capture-output &

echo "Starting supervisord..."
supervisord --configuration=/flask_app/src/app/supervisord.conf --directory=/flask_app/src/app  --logfile=/flask_app/src/app/supervisord.log --loglevel=trace &
echo "supervisord scheduled the tasks succesfully"

# Sleeping, so that rabbitmq-server starts properly.
(sleep 30;
rabbitmqctl add_user $PIKA_USER_HEADLINES_MS_CONTAINER $PIKA_PWD_HEADLINES_MS_CONTAINER 2>/dev/null ; \
rabbitmqctl add_vhost headlinesvhost; \
rabbitmqctl set_user_tags $PIKA_USER_HEADLINES_MS_CONTAINER administrator ; \
rabbitmqctl set_permissions -p headlinesvhost $PIKA_USER_HEADLINES_MS_CONTAINER  ".*" ".*" ".*" ; \
echo "User '$PIKA_USER_HEADLINES_MS_CONTAINER' has been created") & rabbitmq-server
