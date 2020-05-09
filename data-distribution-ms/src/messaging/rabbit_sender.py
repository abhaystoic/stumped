import json
import pika

def send_headlines(headlines):
  credentials = pika.PlainCredentials('admin', 'admin123')
  connection = pika.BlockingConnection(pika.ConnectionParameters(
    'headlines-ms', 5672, '/', credentials))
  channel = connection.channel()
  channel.queue_declare(queue='hello')
  # headlines = {'msg': 'Hello World!'}
  channel.basic_publish(
    exchange='', routing_key='hello', body=json.dumps(headlines))
  print(" [x] Sent Hello World! in JSON format.")
  connection.close()
