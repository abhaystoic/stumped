import json
import os
import pika

def send_headlines(headlines):
  credentials = pika.PlainCredentials(
    os.getenv('PIKA_USER_HEADLINES_MS_CONTAINER'),
    os.getenv('PIKA_PWD_HEADLINES_MS_CONTAINER'))
  connection = pika.BlockingConnection(pika.ConnectionParameters(
    'headlines-ms', 5672, 'headlinesvhost', credentials))
  channel = connection.channel()
  channel.queue_declare(queue='headlines')
  channel.basic_publish(
    exchange='', routing_key='headlines', body=json.dumps(headlines))
  print(" [x] Sent headlines in JSON format.")
  connection.close()
