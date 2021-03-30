"""Celery task for fetching news highlights."""

import json
import newsapi

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger

from .constants import categories
from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchAllNews(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-all-news-task'

  def __init__(self):
    # TODO: Find ways to securely store the API key.
    self.api_key = '6e5fa01bbed34f2cbeb90498cc84792a'
    # self.api_key = '6fd5d00487734e67865343a92ca35903'
    self.configure_news_api()

  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = newsapi.NewsApiClient(self.api_key)

  def run(self):
    all_news = self.fetch_all_news()
    if all_news:
      rabbit_sender.send_all_news(all_news)
    return all_news

  def fetch_all_news(self, retry=False):
    """Celery task to fetch all news and save in the database."""
    all_news = {}
    for topic, categories_list in categories.items():
      for cat in categories_list:
        try:
          news_res = self.news_api.get_everything(
            q=cat, language='en', page_size=100)
          if news_res and news_res['status'] == 'ok':
            if topic in all_news:
              all_news[topic].append(news_res)
            else:
              all_news[topic] = [news_res]
        except newsapi.newsapi_exception.NewsAPIException as err:
          print('NewsAPI Exception==', err)
          if not retry:
            print('Retrying with another key...')
            self.api_key = '420b05784fe64997b5e8f5b23c0a7b72'
            self.configure_news_api()
            self.fetch_all_news(retry=True)
          else:
            return None
        except Exception as err:
          print('Exception occurred==', err)
          return None
    return all_news

app = Celery('all_news.fetch_all_news', broker='amqp://')
app.config_from_object('all_news.celeryconfig')
all_news_task = app.register_task(FetchAllNews())
all_news_task.delay()
