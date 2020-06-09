import json
import pika

from datetime import datetime
from pymongo import MongoClient
from ..sentiment_analyzer import classifier


credentials = pika.PlainCredentials('admin', 'admin123')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
      host='localhost', virtual_host='covid19vhost', credentials=credentials))

channel = connection.channel()

channel.queue_declare(queue='covid19_news')


def callback(ch, method, properties, body):
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['covid19']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  body = json.loads(body)
  print(' [x] Received %r' % body)
  body = classifier.classify(body)
  body['created_time'] = datetime.now()
  rec_id = collection.insert_one(body)
  print('Data inserted with record id= ',rec_id)


channel.basic_consume(
    queue='covid19_news', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
