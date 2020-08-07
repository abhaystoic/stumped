import json

from bson import json_util
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
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

if __name__ == '__main__':
  app.run(host='0.0.0.0')
