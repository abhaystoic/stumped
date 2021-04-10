"""Celery task for fetching news highlights."""

import json
import newsapi
import os

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger

from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchHeadlinesTask(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-headlines-task'

  def __init__(self):
    self.api_key = os.getenv('NEWS_API_KEY_PROD')
    # self.api_key = os.getenv('NEWS_API_KEY_DEV')
    self.configure_news_api()
  
  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = newsapi.NewsApiClient(self.api_key)

  def run(self):
    headlines = self.fetch_headlines()
    if headlines:
      print('Headlines received, sending it to other MS...')
      rabbit_sender.send_headlines(headlines)
    print('Saving a copy of headlines...')
    return headlines

  def fetch_headlines(self, retry=False):
    """Celery task to fetch headlines and save in the database."""
    try:
      top_headlines_res = self.news_api.get_top_headlines(
        country='in', page_size=100)
    except newsapi.newsapi_exception.NewsAPIException as err:
      print('NewsAPI Exception==', err)
      if not retry:
        print('Retrying with another key...')
        self.api_key = os.getenv(NEWS_API_KEY_BACKUP)
        self.configure_news_api()
        self.fetch_headlines(retry=True)
      else:
        return None
    except Exception as err:
      print('Exception occurred==', err)
      return None
    headlines = {}
    if top_headlines_res and top_headlines_res['status'] == 'ok':
      headlines = top_headlines_res
    else:
      headlines = None
    return headlines

app = Celery('headlines.fetch_headlines', broker='amqp://')
app.config_from_object('celery_dd_tasks.headlines.celeryconfig')
headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
