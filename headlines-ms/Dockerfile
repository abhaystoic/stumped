FROM ubuntu:18.04

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 PYTHONUNBUFFERED=1

RUN apt-get update -y
RUN apt-get install python3.6 -y

RUN apt-get install python3-pip -y
RUN pip3 install flask
RUN pip3 install pymongo

COPY . /
ENTRYPOINT FLASK_APP=/src/app/app.py flask run
