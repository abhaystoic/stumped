import json

from bson import json_util
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)


@app.route('/business')
def get_business_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['business']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


@app.route('/entertainment')
def get_entertainment_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['entertainment']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


@app.route('/health')
def get_health_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['health']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


@app.route('/science')
def get_science_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['science']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


@app.route('/sports')
def get_sports_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['sports']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


@app.route('/technology')
def get_technology_news():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['technology']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [{"$sort":{"created_time":-1}}])][0]
  result = {
    'created_time': records['created_time'],
    'articles': [],
    }
  for rec in records['news']:
    for article in rec['articles']:
      result['articles'].append(article)
  return json.dumps(
    result, sort_keys=True, indent=4, default=json_util.default)


if __name__ == '__main__':
  app.run(host='0.0.0.0')
