import json
import os

from bson import json_util
from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PWD = os.getenv('MONGO_PWD')
MONGODB_PORT = os.getenv('MONGODB_PORT')
MONGO_CONNECTION_STRING = (
  f'mongodb://{MONGO_USER}:{MONGO_PWD}@localhost:{MONGODB_PORT}')

app = Flask(__name__)
CORS(app)


@app.route('/')
def get_covid19_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['covid19']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  params = request.args
  current_page = int(params['page'])
  if (current_page > total_docs):
    results = {
      'records': [],
      'max_page': total_docs,
    }
    return json.dumps(
      results, sort_keys=True, indent=4, default=json_util.default)
  record_index_as_per_page = current_page - 1
  records = [
    document for document in collection.aggregate(
      [
        {'$sort':{'created_time':-1}},
        {'$limit': current_page}
      ],
      allowDiskUse=True)][record_index_as_per_page]
  results = {
    'records': records,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)

@app.route('/fetch-news-article', methods = ['GET'])
def get_news_article():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['article_slugs']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  params = request.args
  slug = params['slug']
  article = collection.find_one({'_id': slug})
  return json.dumps(
    article, sort_keys=True, indent=4, default=json_util.default)

if __name__ == '__main__':
  app.run(host='0.0.0.0')
