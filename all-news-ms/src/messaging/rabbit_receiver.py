import json
import pika

from datetime import datetime
from pymongo import MongoClient


credentials = pika.PlainCredentials('admin', 'admin123')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
      host='localhost', virtual_host='allnewsvhost', credentials=credentials))

channel = connection.channel()

channel.queue_declare(queue='all_news')


def callback(ch, method, properties, body):
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['all_news']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  print(' [x] Received %r' % body)
  body = json.loads(body)
  body['created_time'] = datetime.now()
  rec_id = collection.insert_one(body)
  print('Data inserted with record id= ',rec_id)


channel.basic_consume(
    queue='all_news', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
