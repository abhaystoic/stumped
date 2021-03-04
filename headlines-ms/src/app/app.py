import json

from bson import json_util
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)


@app.route('/')
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

@app.route('/save-user')
def saveUser():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.user
  collection_preferences = db['user_preferences']
  user_info = request.args.get('user_info')
  print('user_info===>', user_info)
  # body = json.loads(body)
  # print(' [x] Received %r' % body)
  # body = classifier.classify(body)
  # try:
  #   elasticsearch_indexer.create_es_index(body['articles'])
  # except Exception:
  #   print('Failed to create elastic search index.')
  #   pass
  # tz = pytz.timezone('Asia/Kolkata')
  # body['created_time'] = datetime.now(tz)
  # rec_id = collection.insert_one(body)
  # print('Data inserted with record id= ', rec_id)

if __name__ == '__main__':
  app.run(host='0.0.0.0')
