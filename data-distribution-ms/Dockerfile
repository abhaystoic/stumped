FROM ubuntu:18.04

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1

RUN apt-get update -y
RUN apt-get install python3.6 -y

RUN apt-get install python3-pip -y
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

RUN apt-get install wget -y

RUN wget -O- https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | apt-key add -
RUN echo "deb https://packages.erlang-solutions.com/ubuntu bionic contrib" | tee /etc/apt/sources.list.d/rabbitmq.list
RUN apt update
RUN apt install erlang -y 

RUN wget -O- https://dl.bintray.com/rabbitmq/Keys/rabbitmq-release-signing-key.asc | apt-key add -
RUN wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | apt-key add -
RUN echo "deb https://dl.bintray.com/rabbitmq/debian $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/rabbitmq.list
RUN apt update
RUN apt install rabbitmq-server -y 

COPY . /
