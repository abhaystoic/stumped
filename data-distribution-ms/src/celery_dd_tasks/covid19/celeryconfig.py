from celery.schedules import crontab

# TODO: Use environment variables wherever possible.
enable_utc = True
timezone = 'Asia/Kolkata'
# broker_url = 'amqp://admin:admin123@localhost:5672/vhost'
broker = 'amqp'
backend = 'amqp'
task_serializer = 'json'
accept_content = ['json']  # Ignore other content
result_serializer = 'json'
result_backend = 'mongodb'
mongodb_backend_settings = {
  'host': '127.0.0.1',
  'port': 27017,
  'database': 'news',
  'taskmeta_collection': 'covid19',
}
beat_schedule = {
  'every_hour': {
    'task': 'fetch-covid19-news-task',
    'options': {'queue': 'covid19'},
    'schedule': crontab(minute=0, hour='*/1'), # Every hour.
    # 'schedule': crontab(minute='*/15'), # Every 15 minutes.
  }
}
