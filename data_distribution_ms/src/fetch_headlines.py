"""Celery task for fetching news highlights."""

import json

from celery import Celery    
from celery.utils.log import get_task_logger

from base_task import DatabaseTask

logger = get_task_logger(__name__)


class FetchHeadlinesTask(DatabaseTask):
  """Celery task to fetch headlines and save in the database."""

  # ignore_result = False
  name = 'fetch-headlines-task'

  def __init__(self):
    pass

  def run(self):
    self.fetch_headlines()

  def fetch_headlines(self):
    """Celery task to fetch headlines and save in the database."""
    f = open('../sample_data/headlines.json', 'r')
    headlines = json.loads(f.read())
    f.close()
    return headlines['articles']

app = Celery('fetch_headlines', backend='amqp', broker='amqp://')
headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
