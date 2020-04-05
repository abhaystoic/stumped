"""Module for scheduling celery tasks."""

from fetch_headlines import app
from fetch_headlines import FetchHeadlinesTask


headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
