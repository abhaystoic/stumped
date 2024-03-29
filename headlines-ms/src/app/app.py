import json
import os
from datetime import datetime

import pytz
from bson import json_util
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

def _sanitize(data: dict) -> dict:
  if not isinstance(data, dict):
    return data
  for key in tuple(data):
    old_key = key
    if isinstance(key, str) and ('$' in key or '.' in key):
      key = key.replace('$', 'DOLLAR')
      key = key.replace('.', 'DOT')
      data[key] = data[old_key]
      del data[old_key]
  # Remove the 'response' key as it is having redundant data.
  if 'response' in data:
      del data['response']
  return data

@app.route('/', methods = ['GET'])
def get_headlines():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.news
  collection = db['headline']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  params = request.args
  current_page = int(params['page'])
  if (current_page > total_docs):
    results = {
      'records': [],
      'max_pages': total_docs,
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
    'max_pages': total_docs,
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

@app.route('/user/get-saved-news-and-sentiments', methods = ['POST'])
def get_saved_news_and_sentiments():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_user_saved_news = db['user_saved_news']
  collection_user_sentiments = db['user_sentiments']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']
  news_article_urls = params['news-article-ids']

  saved_news_ids = []
  saved_news_sentiments = {}
  for article_url in news_article_urls:
    # Saved news articles.
    article = collection_user_saved_news.find_one(
      {'user_id': user_id, 'news_article_id': article_url})
    if (article):
      saved_news_ids.append(article_url)
    
    # Saved news sentiments.
    saved_sentiment = collection_user_sentiments.find_one(
      {'user_id': user_id, 'news_article_id': article_url})
    print('saved_sentiment==>', saved_sentiment)
    if (saved_sentiment):
      saved_news_sentiments[article_url] = saved_sentiment['sentiment']
  print('saved_news_ids==>', saved_news_ids)
  print('saved_news_sentiments==>', saved_news_sentiments)

  return {
    'success': True,
    'saved_news_ids': saved_news_ids,
    'saved_news_sentiments': saved_news_sentiments,
  }

@app.route('/user/get-saved-news-articles', methods = ['POST'])
def get_saved_news_articles():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db_user = mongo_client.user
  db_news = mongo_client.news
  collection_user_saved_news = db_user['user_saved_news']
  collection_headlines = db_news['headline']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']

  saved_news_articles_info = collection_user_saved_news.find(
    {'user_id': user_id}).sort('last_updated')

  all_news = {}
  collection_headlines_records = [
    document for document in collection_headlines.aggregate(
      [
        {'$sort':{'created_time':-1}},
      ],
      allowDiskUse=True)]
  for news_group in collection_headlines_records:
    for news in news_group.get('articles') or []:
      all_news[news['url']] = news
  saved_news_articles = []
  for doc in saved_news_articles_info:
    found_news = all_news.get(doc['news_article_id'])
    if found_news:
      saved_news_articles.append(found_news)
  # print('saved_news_articles==', saved_news_articles)

  return json_util.dumps({
    'success': True,
    'saved_news_articles': saved_news_articles,
  })

@app.route('/user/save-news', methods = ['POST'])
def save_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_user_saved_news = db['user_saved_news']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']
  tz = pytz.timezone('Asia/Kolkata')

  user_news = {
    'user_id': user_id,
    'email': params['email'],
    'provider': params['provider'],
    'news_article_id': params['news-article-id'],
    'last_updated': datetime.now(tz),
  }
  rec_id = collection_user_saved_news.insert_one(user_news)
  if (rec_id):
    print('Data inserted with record id= ', rec_id)
  return {'success': True}

@app.route('/user/save-sentiments', methods = ['POST'])
def save_sentiments():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_user_sentiments = db['user_sentiments']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']
  tz = pytz.timezone('Asia/Kolkata')

  user_news_sentiment = {
    'user_id': user_id,
    'email': params['email'],
    'provider': params['provider'],
    'news_article_id': params['news-article-id'],
    'sentiment': params['sentiment'],
    'last_updated': datetime.now(tz),
  }
  rec_id = collection_user_sentiments.update(
      { 'user_id': user_id, 'news_article_id': params['news-article-id'] },
      user_news_sentiment, upsert=True)
  if (rec_id):
    print('Data inserted with record id= ', rec_id)
  return {'success': True}

@app.route('/user/unsave-news', methods = ['POST'])
def un_save_news():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_user_saved_news = db['user_saved_news']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']

  rec_deleted = collection_user_saved_news.delete_one(
      {'user_id': user_id, 'news_article_id': params['news-article-id']})
  if (rec_deleted):
    print(rec_deleted.deleted_count, " documents deleted.")
  return {'success': True}

@app.route('/user/save-user', methods = ['POST'])
def save_user():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_preferences = db['user_preferences']
  user = request.get_json()
  mongodb_id = user['email'] + '-' + user['provider']
  user['_id'] = mongodb_id
  tz = pytz.timezone('Asia/Kolkata')
  user['last_updated'] = datetime.now(tz)
  existing_user = collection_preferences.find_one({'_id': mongodb_id})
  default_preferences = {
    'activist': False,
    'adventure': False,
    'arts': False,
    'automobiles': False,
    'culture': False,
    'economics': False,
    'entertainment': False,
    'environmental': False,
    'faith': False,
    'games': False,
    'health': False,
    'international': False,
    'investmets': False,
    'jobs': False,
    'local': False,
    'national': False,
    'politics': False,
    'science': False,
    'sports': False,
    'technology': False,
    'travel': False,
    'weather': False,
    }
  if existing_user:
    if 'preferences' in existing_user:
      if 'preferences' not in user:
        # Case when user logs in initially without touching the preferences.
        user['preferences'] = existing_user['preferences']
    else:
      user['preferences'] = default_preferences
    rec_id = collection_preferences.update(
      {'_id': mongodb_id}, _sanitize(user), upsert=True)
  else:
    user['_id'] = mongodb_id
    user['preferences'] = default_preferences
    rec_id = collection_preferences.insert_one(_sanitize(user))
  if (rec_id):
    print('Data inserted with record id= ', rec_id)
  return {'success': True, 'user': user}

@app.route('/user/save-feedback', methods = ['POST'])
def save_feedback():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_feedback = db['user_feedback']
  feedback = request.get_json()
  tz = pytz.timezone('Asia/Kolkata')
  feedback['last_updated'] = datetime.now(tz)
  print('feedback===>', feedback)
  rec_id = collection_feedback.insert_one(feedback)
  if rec_id:
    print('Data inserted with record id= ', rec_id)
  return {'success': True}

@app.route('/user/subscribe-user', methods = ['PUT'])
def subscribe_user():
  mongo_client = MongoClient(MONGO_CONNECTION_STRING)
  db = mongo_client.user
  collection_subscribers = db['user_subscribers']
  user = request.get_json()
  mongodb_id = user['email']
  user['_id'] = mongodb_id
  tz = pytz.timezone('Asia/Kolkata')
  user['last_updated'] = datetime.now(tz)
  user['_id'] = mongodb_id
  rec_id = collection_subscribers.update(
    {'_id': mongodb_id}, _sanitize(user), upsert=True)
  if rec_id:
    print('Data inserted/updated with record id= ', rec_id)
  return {'success': True, 'user': user}

if __name__ == '__main__':
  app.run(host='0.0.0.0')
