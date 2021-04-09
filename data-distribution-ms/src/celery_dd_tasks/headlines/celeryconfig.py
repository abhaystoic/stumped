import os

from celery.schedules import crontab

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PWD = os.getenv('MONGO_PWD')
MONGODB_PORT = os.getenv('MONGODB_PORT')
MONGO_CONNECTION_STRING = (f'mongodb://{MONGO_USER}:{MONGO_PWD}@localhost')

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
  'host': 'localhost',
  'port': MONGODB_PORT,
  'database': 'news',
  'taskmeta_collection': 'headline',
  'user': MONGO_USER,
  'password': MONGO_PWD,
}
beat_schedule = {
  'every_hour': {
    'task': 'fetch-headlines-task',
    'options': {'queue': 'headlines'},
    # 'schedule': crontab(minute=0, hour='*/1'), # Every hour.
    'schedule': crontab(minute='*/5'), # Every 5 minutes.
  }
}
