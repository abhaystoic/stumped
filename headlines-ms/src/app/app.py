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
  print('Data inserted with record id= ', rec_id)
  return {'success': True, 'user': user}

if __name__ == '__main__':
  app.run(host='0.0.0.0')
