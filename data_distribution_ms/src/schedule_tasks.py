"""Module for scheduling celery tasks."""

from fetch_headlines import app
from fetch_headlines import FetchHeadlinesTask


headlines_task = app.register_task(FetchHeadlinesTask())
headlines_task.delay()
# headlines_task.apply_async(eta=datetime(2015, 6, 5, 12, 30, 22))
# print(headlines_task.ready())
# print(headlines_task.get(timeout=1))
# print('Traceback:')
# print(headlines_task.traceback)
