from elasticsearch import Elasticsearch


def create_es_index(covid19_news):
  es = Elasticsearch([{'host': 'elastic-search-ms','port': 9200}])
  es_body = {}
  for news in covid19_news:
    res = es.index(
      index='news-search', doc_type='news', id=news['url'], body=news)
