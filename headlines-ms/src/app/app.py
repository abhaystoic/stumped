import json

from bson import json_util
from flask import Flask
from pymongo import MongoClient


app = Flask(__name__)


@app.route('/')
def hello():
  mongo_client = MongoClient('mongodb://localhost:27017')
  db = mongo_client.news
  collection = db['headlines']
  total_docs = collection.count_documents({})
  print(total_docs, ' total documents.')
  records = [document for document in collection.find({})]
  return json.dumps(
    records, sort_keys=True, indent=4, default=json_util.default)

if __name__ == '__main__':
  app.run(host='0.0.0.0')
