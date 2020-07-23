"""Celery task for fetching news highlights."""

import json

from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger
from newsapi import NewsApiClient

from .messaging import rabbit_sender
from .constants import categories

logger = get_task_logger(__name__)


class FetchAllNews(Task):
  """Celery task to fetch headlines and save in the database."""

  name = 'fetch-all-news-task'
  # TODO: Find ways to securely store the API key.
  API_KEY = '6e5fa01bbed34f2cbeb90498cc84792a'

  def __init__(self):
    self.configure_news_api()

  def configure_news_api(self):
    """Configures the News API."""
    self.news_api = NewsApiClient(FetchAllNews.API_KEY)

  def run(self):
    all_news = self.fetch_all_news()
    rabbit_sender.send_all_news(all_news)
    return all_news

  def fetch_all_news(self):
    """Celery task to fetch all news and save in the database."""
    all_news = {}
    for topic, categories_list in categories.items():
      for cat in categories_list:
        news_res = self.news_api.get_everything(q=cat, language='en', page_size=100)
        if news_res['status'] == 'ok':
          if topic in all_news:
            all_news[topic].append(news_res)
          else:
            all_news[topic] = [news_res]
    return all_news

app = Celery('all_news.fetch_all_news', broker='amqp://')
app.config_from_object('all_news.celeryconfig')
all_news_task = app.register_task(FetchAllNews())
all_news_task.delay()
