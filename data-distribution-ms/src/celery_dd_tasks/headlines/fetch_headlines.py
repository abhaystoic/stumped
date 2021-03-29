"""Celery task for fetching news highlights."""

import json
import newsapi

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger

from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchHeadlinesTask(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-headlines-task'

  def __init__(self):
    # TODO: Find ways to securely store the API key.
    self.api_key = '6e5fa01bbed34f2cbeb90498cc84792a'
    # self.api_key = '6fd5d00487734e67865343a92ca35903'
    self.configure_news_api()
  
  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = newsapi.NewsApiClient(self.api_key)

  def run(self):
    headlines = self.fetch_headlines()
    if headlines:
      rabbit_sender.send_headlines(headlines)
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
        self.api_key = '420b05784fe64997b5e8f5b23c0a7b72'
        self.configure_news_api()
        self.fetch_headlines(retry=True)
      else:
        return None
    except Exception as err:
      print('Exception occurred==', err)
      return None
    headlines = {}
    if top_headlines_res['status'] == 'ok':
      headlines = top_headlines_res
    return headlines

app = Celery('headlines.fetch_headlines', broker='amqp://')
app.config_from_object('headlines.celeryconfig')
headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
