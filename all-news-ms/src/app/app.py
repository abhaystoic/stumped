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


@app.route('/business')
def get_business_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['business']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)


@app.route('/entertainment')
def get_entertainment_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['entertainment']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)


@app.route('/health')
def get_health_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['health']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)


@app.route('/science')
def get_science_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['science']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)


@app.route('/sports')
def get_sports_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['sports']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
    'max_page': total_docs,
  }
  return json.dumps(
    results, sort_keys=True, indent=4, default=json_util.default)


@app.route('/technology')
def get_technology_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['technology']
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
  final_results = {
    'created_time': records['created_time'],
    'articles': [],
  }
  for rec in records['news']:
    for article in rec['articles']:
      final_results['articles'].append(article)
  results = {
    'records': final_results,
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
