"""Celery task for fetching news highlights."""

import datetime
import json
import newsapi
import os

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger

from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchCovid19NewsTask(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-covid19-news-task'

  def __init__(self):
    # self.api_key = os.getenv('NEWS_API_KEY_PROD')
    self.api_key = os.getenv('NEWS_API_KEY_DEV')
    self.configure_news_api()

  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = newsapi.NewsApiClient(self.api_key)

  def run(self):
    covid19_news = self.fetch_covid19_news()
    if covid19_news:
      rabbit_sender.send_covid19_news(covid19_news)
    return covid19_news

  def fetch_covid19_news(self, retry=False):
    """Celery task to fetch covid19 news and save in the database."""
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days = 1)
    try:
      covid19_news_res = self.news_api.get_everything(
        q='covid19 AND coronavirus', language='en', page_size=100,
        from_param=yesterday, to=today, sort_by='publishedAt')
    except newsapi.newsapi_exception.NewsAPIException as err:
      print('NewsAPI Exception==', err)
      if not retry:
        print('Retrying with another key...')
        self.api_key = os.getenv(NEWS_API_KEY_BACKUP)
        self.configure_news_api()
        self.fetch_covid19_news(retry=True)
      else:
        return None
    except Exception as err:
      print('Exception occurred==', err)
      return None
    covid19_news = {}
    if covid19_news_res and covid19_news_res['status'] == 'ok':
      covid19_news = covid19_news_res
    else:
      covid19_news = None
    return covid19_news

app = Celery('covid19.fetch_covid19_news', broker='amqp://')
app.config_from_object('celery_dd_tasks.covid19.celeryconfig')
covid19_news_task = app.register_task(FetchCovid19NewsTask())
covid19_news_task.delay()
