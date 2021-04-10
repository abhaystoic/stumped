from elasticsearch import Elasticsearch


def create_es_index(all_news):
  es = Elasticsearch([{'host': 'elastic-search-ms','port': 9200}])
  es_body = {}
  for topic, categ_news in all_news.values():
    for rec in categ_news:
      for article in rec['articles']:
        # Elasticsearch won't index _id field as it is a reserved word.
        if '_id' in article:
          del article['_id']
        res = es.index(
          index='news-search', doc_type='news', id=article['url'], body=article)
# es = Elasticsearch([{'host': '172.18.0.2','port': 9200}])
# es_body = {
#   'title': 'hello',
#   'description': 'awesome',
#   'content': 'nice',
# }
# res = es.index(
#   index='news-search', doc_type='news', id='url', body=es_body)
# print(res)
# es.indices.refresh(index='news-search')
# res= es.search(index='news-search',body={'query':{'match':{'content': 'content2'}}})
# print(res)
# print('Got %d hits - ' %res['hits']['total']['value'])
# print(res['hits']['hits'])
