from elasticsearch import Elasticsearch


def create_es_index(headlines):
  es = Elasticsearch([{'host': 'elastic-search-ms','port': 9200}])
  es_body = {}
  for news in headlines:
    # Elasticsearch won't index _id field as it is a reserved word.
    if '_id' in news:
      del news['_id']
    res = es.index(
      index='news-search', doc_type='news', id=news['url'], body=news)
