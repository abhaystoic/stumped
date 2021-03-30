"""Celery task for fetching news highlights."""

import json
import newsapi

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger

from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchCovid19NewsTask(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-covid19-news-task'

  def __init__(self):
    # TODO: Find ways to securely store the API key.
    self.api_key = '6e5fa01bbed34f2cbeb90498cc84792a'
    # self.api_key = '6fd5d00487734e67865343a92ca35903'
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
    try:
      covid19_news_res = self.news_api.get_everything(
        q='covid19 AND coronavirus', language='en', page_size=100)
    except newsapi.newsapi_exception.NewsAPIException as err:
      print('NewsAPI Exception==', err)
      if not retry:
        print('Retrying with another key...')
        self.api_key = '420b05784fe64997b5e8f5b23c0a7b72'
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
app.config_from_object('covid19.celeryconfig')
covid19_news_task = app.register_task(FetchCovid19NewsTask())
covid19_news_task.delay()
