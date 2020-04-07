celery worker -A src/fetch_headlines --loglevel=info &
celery -A src/fetch_headlines beat --loglevel=info -s ./celery-beat-logs/ &