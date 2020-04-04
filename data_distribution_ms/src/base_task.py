"""Base Task configurations for Celery tasks."""

from celery import Task


class DatabaseTask(Task):
  _db = None

  @property
  def db(self):
    if self._db is None:
      pass
      # self._db = Database.connect()
    return self._db
