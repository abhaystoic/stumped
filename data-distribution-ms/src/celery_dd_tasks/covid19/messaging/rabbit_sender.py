import json
import os
import pika

def send_covid19_news(covid19_news):
  credentials = pika.PlainCredentials(
    os.getenv('PIKA_USER_COVID19_MS_CONTAINER'),
    os.getenv('PIKA_PWD_COVID19_MS_CONTAINER'))
  connection = pika.BlockingConnection(pika.ConnectionParameters(
    'covid19-ms', 5672, 'covid19vhost', credentials))
  channel = connection.channel()
  channel.queue_declare(queue='covid19_news')
  channel.basic_publish(
    exchange='', routing_key='covid19_news', body=json.dumps(covid19_news))
  print(" [x] Sent covide19 in JSON format.")
  connection.close()  
