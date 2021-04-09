import json
import os
import pika

def send_all_news(all_news):
  credentials = pika.PlainCredentials(
    os.getenv('PIKA_USER_ALL_NEWS_MS_CONTAINER'),
    os.getenv('PIKA_PWD_ALL_NEWS_MS_CONTAINER'))
  connection = pika.BlockingConnection(pika.ConnectionParameters(
    'all-news-ms', 5672, 'allnewsvhost', credentials))
  channel = connection.channel()
  channel.queue_declare(queue='all_news')
  channel.basic_publish(
    exchange='', routing_key='all_news', body=json.dumps(all_news))
  print(" [x] Sent all news in JSON format.")
  connection.close()
