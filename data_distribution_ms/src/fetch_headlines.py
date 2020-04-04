"""Celery task for fetching news highlights."""

import json

from celery import Celery    
from celery.utils.log import get_task_logger
from newsapi import NewsApiClient

from base_task import DatabaseTask

logger = get_task_logger(__name__)


class FetchHeadlinesTask(DatabaseTask):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-headlines-task'
  # TODO: Find ways to securely store the API key.
  API_KEY = '6e5fa01bbed34f2cbeb90498cc84792a'

  def __init__(self):
    self.configure_news_api()
  
  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = NewsApiClient(FetchHeadlinesTask.API_KEY)

  def run(self):
    return self.fetch_headlines()

  def fetch_headlines(self):
    """Celery task to fetch headlines and save in the database."""
    top_headlines_res = self.news_api.get_top_headlines(
      language='en', country='in', page_size=100)
    headlines = {}
    if top_headlines_res['status'] == 'ok':
      headlines = top_headlines_res
    return headlines

app = Celery('fetch_headlines', broker='amqp://')
app.config_from_object('celeryconfig')
headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
