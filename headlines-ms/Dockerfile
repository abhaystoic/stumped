FROM rabbitmq:3-management

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1 TZ=Asia/Kolkata
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y
RUN apt-get install build-essential -y
RUN apt-get install -y python-setuptools
RUN apt-get install -y vim
RUN apt-get install python3.6 -y
RUN apt-get install python3-pip -y

RUN apt install -y apache2 apache2-utils
RUN apt-get install -y libapache2-mod-wsgi-py3
RUN /etc/init.d/apache2 restart
RUN pip3 install --upgrade pip setuptools


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

# Expose ports from the container to the host
EXPOSE 27017 80 443

COPY . /flask_app

COPY ./app.conf /etc/apache2/sites-available/

RUN rm -rf /etc/apache2/sites-available/000-default.conf
RUN rm -rf /etc/apache2/sites-enabled/000-default.conf

RUN /bin/sh /etc/apache2/envvars

RUN a2ensite app.conf
RUN /etc/init.d/apache2 restart

WORKDIR /flask_app/src

RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

# RUN nohup python3 -u messaging/rabbit_receiver.py > /headlines_logs/output.log &
