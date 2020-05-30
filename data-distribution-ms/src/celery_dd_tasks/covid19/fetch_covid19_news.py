"""Celery task for fetching news highlights."""

import json

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger
from newsapi import NewsApiClient

from .messaging import rabbit_sender

logger = get_task_logger(__name__)


class FetchCovid19NewsTask(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-covid19-news-task'
  # TODO: Find ways to securely store the API key.
  API_KEY = '6e5fa01bbed34f2cbeb90498cc84792a'

  def __init__(self):
    self.configure_news_api()
  
  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = NewsApiClient(FetchCovid19NewsTask.API_KEY)

  def run(self):
    covid19_news = self.fetch_covid19_news()
    rabbit_sender.send_covid19_news(covid19_news)
    return covid19_news

  def fetch_covid19_news(self):
    """Celery task to fetch covid19 news and save in the database."""
    covid19_news_res = self.news_api.get_everything(
      qintitle='covid19 AND coronavirus', page_size=100)
    covid19_news = {}
    if covid19_news_res['status'] == 'ok':
      covid19_news = covid19_news_res
    return covid19_news

app = Celery('celery_dd_tasks.covid19.fetch_covid19_news', broker='amqp://')
app.config_from_object('celeryconfig')
covid19_news_task = app.register_task(FetchCovid19NewsTask())
covid19_news_task.delay()
