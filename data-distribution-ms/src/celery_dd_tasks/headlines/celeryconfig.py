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
  'taskmeta_collection': 'headline',
}
beat_schedule = {
  "every_hour": {
    "task": "fetch-headlines-task",
    "schedule": crontab(minute='*/1'), # Every 9 minutes.
    "options": {"queue": "headlines"},
    # "schedule": crontab(minute=0, hour='*/1'), # Every hour.
  }
}
