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
  preferences = request.get_json()
  mongodb_id = preferences['email'] + '-' + preferences['provider']
  preferences['_id'] = mongodb_id
  tz = pytz.timezone('Asia/Kolkata')
  preferences['created_time'] = datetime.now(tz)
  print('preferences== ', preferences)
  rec_id = collection_preferences.update(
    {'_id': mongodb_id}, preferences, upsert=True)
  print('Data inserted with record id= ', rec_id)
  return {'success': True}

if __name__ == '__main__':
  app.run(host='0.0.0.0')
