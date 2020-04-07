"""Celery App."""

from celery import Celery


app = Celery('fetch_headlines', backend='amqp', broker='amqp://')
# app.config_from_object('celeryconfig')
