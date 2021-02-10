import json
import pika
import pytz

from datetime import datetime
from pymongo import MongoClient
from search import elasticsearch_indexer
from sentiment_analyzer import classifier


credentials = pika.PlainCredentials('admin', 'admin123')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
      host='localhost', virtual_host='allnewsvhost', credentials=credentials))

channel = connection.channel()

channel.queue_declare(queue='all_news')


def callback(ch, method, properties, body):
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  body = json.loads(body)
  print(' [x] Received %r' % body)
  body = classifier.classify(body)
  try:
    elasticsearch_indexer.create_es_index(body)
  except Exception:
    print('Failed to create elastic search index.')
    pass
  tz = pytz.timezone('Asia/Kolkata')
  for topic, news in body.items():
    collection = db[topic]
    rec_id = collection.insert_one({
      'news': news,
      'created_time': datetime.now(tz),
      })
    print('Data inserted with record id= ',rec_id)


channel.basic_consume(
    queue='all_news', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
