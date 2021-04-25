#!/bin/sh

# Remove --nojournal when the system grows big.
mongod --bind_ip_all --port $MONGODB_PORT --nojournal &
sleep 10
echo "###########################################################################################################################"
echo "Creating app users..."
mongo admin --host localhost --port $MONGODB_PORT --eval "db.createUser({user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD',roles: ['root', 'userAdminAnyDatabase','userAdmin','readWrite','dbAdmin','clusterAdmin','readWriteAnyDatabase','dbAdminAnyDatabase']});"
echo "App users created..."
mongo admin --host localhost --port $MONGODB_PORT --eval "db.getSiblingDB('admin').shutdownServer()"
# mongod --shutdown
sleep 10
echo "---------------------------------------------------------------------------------------------"
echo "Starting mongo again with auth enabled..."
mongod --bind_ip_all --port $MONGODB_PORT --auth --nojournal &
sleep 10
mongo admin --host localhost --port $MONGODB_PORT --eval "db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PWD',roles: ['readWriteAnyDatabase']});" -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD
rabbitmq-server start &
supervisord --configuration=/app/src/celery_dd_tasks/supervisord.conf --directory=/app/src/celery_dd_tasks  --logfile=/app/src/celery_dd_tasks/supervisord.log --loglevel=trace
echo "supervisord ran successfully"
