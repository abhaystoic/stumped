FROM rabbitmq:3-management

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1 TZ=Asia/Kolkata
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y
RUN apt-get install build-essential -y
RUN apt-get install -y python-setuptools
RUN apt-get install -y vim
RUN apt-get install python3.6 -y
RUN apt-get install python3-pip -y
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

RUN apt-get install wget -y

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN apt-get install gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
# Update apt-get sources AND install MongoDB
RUN apt-get update && apt-get install -y mongodb-org

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Create the MongoDB data directory
RUN mkdir -p /data/code

# Expose port #27017 from the container to the host
EXPOSE 27017

# Set /usr/bin/mongod as the dockerized entry-point application
# ENTRYPOINT ["/bin/bash"]

# RUN mongo --host mongo --eval  "db.getSiblingDB('news').createUser({user:'admin', pwd:'admin123', roles:[{role:'readWrite',db:'news'}]});"
# RUN rabbitmqctl add_user admin admin123

COPY . /app

WORKDIR /app/src

RUN chmod +x ./docker-entrypoint.sh

CMD ./docker-entrypoint.sh

# RUN nohup celery worker -A fetch_headlines --loglevel=info &


# RUN celery -A fetch_headlines beat --loglevel=info -s ./celery-beat-logs/ &

# RUN mongod --repair
# RUN mongod --port 27017 --bind_ip_all &
# COPY ./scripts/docker-entrypoint.sh /usr/local/bin/
# RUN ln -s /usr/local/bin/docker-entrypoint.sh /
# RUN chmod +x /docker-entrypoint.sh
# ENTRYPOINT /docker-entrypoint.sh
