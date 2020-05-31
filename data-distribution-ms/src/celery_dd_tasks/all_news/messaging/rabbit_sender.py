import json
import pika

def send_all_news(all_news):
  credentials = pika.PlainCredentials('admin', 'admin123')
  connection = pika.BlockingConnection(pika.ConnectionParameters(
    'all-news-ms', 5672, 'allnewsvhost', credentials))
  channel = connection.channel()
  channel.queue_declare(queue='all_news')
  channel.basic_publish(
    exchange='', routing_key='all_news', body=json.dumps(all_news))
  print(" [x] Sent Hello World! in JSON format.")
  connection.close()  
