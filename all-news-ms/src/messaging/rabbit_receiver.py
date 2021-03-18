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
  body['articles'] = create_unique_links(db, body['articles'])
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

def create_unique_links(db, articles):
  collection = db['article_slugs']
  tz = pytz.timezone('Asia/Kolkata')
  created_time = datetime.now(tz)
  articles_with_slugs = []
  for article in articles:
    article['created_time'] = created_time
    slug = get_slug(article['title'])
    article['slug'] = slug
    articles_with_slugs.append(article)
    article['_id'] = slug
    try:
      rec_id = collection.insert_one(article)
      print('Unique link inserted with record id= ', rec_id)
    except Exception as e:
      print("An exception occurred while creating unique slug::", e)
      pass
  return articles_with_slugs

def get_slug(title):
  # TODO: Append timestamp to the slug to avoid duplicate entries.
  return slugify(title)

channel.basic_consume(
    queue='all_news', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
