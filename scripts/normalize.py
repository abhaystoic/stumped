import json
import os
import pika
import pytz

from datetime import datetime
from pymongo import MongoClient
from search import elasticsearch_indexer
from sentiment_analyzer import classifier
from slugify import slugify

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PWD = os.getenv('MONGO_PWD')
MONGO_CONNECTION_STRING = f'mongodb://{MONGO_USER}:{MONGO_PWD}@localhost:27017'


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

def normalize():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['covid19']
  collection_new = db['covid19_new']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [
        {'$sort':{'created_time': 1}}
      ],
      allowDiskUse=True)]
  for rec in records:
    create_unique_links(db, rec['articles'])
    for news in rec['articles']:
      news['_id'] = news['url']
      news['created_time'] = rec['created_time']
      try:
        rec_id = collection_new.insert_one(news)
        print('Data inserted with record id= ',rec_id)
      except Exception as e:
        print("An exception occurred while inserting.::", e)
        pass


if __name__ == '__main__':
  normalize()
