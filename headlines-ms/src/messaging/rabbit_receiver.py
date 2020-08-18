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
      host='localhost', virtual_host='headlinesvhost', credentials=credentials))

channel = connection.channel()

channel.queue_declare(queue='headlines')


def callback(ch, method, properties, body):
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['headline']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  body = json.loads(body)
  print(' [x] Received %r' % body)
  body = classifier.classify(body)
  elasticsearch_indexer.create_es_index(body['articles'])
  tz = pytz.timezone('Asia/Kolkata')
  body['created_time'] = datetime.now(tz)
  rec_id = collection.insert_one(body)
  print('Data inserted with record id= ',rec_id)


channel.basic_consume(
    queue='headlines', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
