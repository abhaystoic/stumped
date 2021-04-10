"""Celery task for fetching news highlights."""

import datetime
import json
import newsapi
import os

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
    self.api_key = os.getenv('NEWS_API_KEY_PROD')
    # self.api_key = os.getenv('NEWS_API_KEY_DEV')
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
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days = 1)
    for topic, categories_list in categories.items():
      for cat in categories_list:
        try:
          news_res = self.news_api.get_everything(
            q=cat, language='en', page_size=100, from_param=yesterday, to=today,
            sort_by='publishedAt')
          if news_res and news_res['status'] == 'ok':
            if topic in all_news:
              all_news[topic].append(news_res)
            else:
              all_news[topic] = [news_res]
        except newsapi.newsapi_exception.NewsAPIException as err:
          print('NewsAPI Exception==', err)
          if not retry:
            print('Retrying with another key...')
            self.api_key = os.getenv('NEWS_API_KEY_BACKUP')
            self.configure_news_api()
            self.fetch_all_news(retry=True)
          else:
            return None
        except Exception as err:
          print('Exception occurred==', err)
          return None
    return all_news

app = Celery('all_news.fetch_all_news', broker='amqp://')
app.config_from_object('celery_dd_tasks.all_news.celeryconfig')
all_news_task = app.register_task(FetchAllNews())
all_news_task.delay()
