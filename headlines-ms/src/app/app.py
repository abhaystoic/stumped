import json
import pytz

from bson import json_util
from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)


@app.route('/', methods = ['GET'])
def getHeadlines():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['headline']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [
    document for document in collection.aggregate(
      [
        {'$sort':{'created_time':-1}},
        {'$limit': 1}
      ],
      allowDiskUse=True)][0]
  return json.dumps(
    records, sort_keys=True, indent=4, default=json_util.default)

@app.route('/get-saved-news-and-sentiments', methods = ['POST'])
def getSavedNewsAndSentiments():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.user
  collection_user_headlines = db['user_headlines']
  collection_user_sentiments = db['user_sentiments']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']
  news_article_urls = params['news-article-ids']

  saved_news_ids = []
  saved_news_sentiments = {}
  for article_url in news_article_urls:
    # Saved news articles.
    article = collection_user_headlines.find_one(
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

@app.route('/save-news', methods = ['POST'])
def saveNews():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.user
  collection_user_headlines = db['user_headlines']
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
  rec_id = collection_user_headlines.insert_one(user_news)
  if (rec_id):
    print('Data inserted with record id= ', rec_id)
  return {'success': True}

@app.route('/save-sentiments', methods = ['POST'])
def saveSentiments():
  mongo_client = MongoClient('mongodb://localhost:27017')
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

@app.route('/unsave-news', methods = ['POST'])
def unSaveNews():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.user
  collection_user_headlines = db['user_headlines']
  params = request.get_json()
  user_id = params['email'] + '-' + params['provider']

  rec_deleted = collection_user_headlines.delete_one(
      {'user_id': user_id, 'news_article_id': params['news-article-id']})
  if (rec_deleted):
    print(rec_deleted.deleted_count, " documents deleted.")
  return {'success': True}

@app.route('/save-user', methods = ['POST'])
def saveUser():
  mongo_client = MongoClient('mongodb://localhost:27017')
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
      {'_id': mongodb_id}, user, upsert=True)
  else:
    user['_id'] = mongodb_id
    user['preferences'] = default_preferences
    rec_id = collection_preferences.insert_one(user)
  if (rec_id):
    print('Data inserted with record id= ', rec_id)
  return {'success': True, 'user': user}

if __name__ == '__main__':
  app.run(host='0.0.0.0')
