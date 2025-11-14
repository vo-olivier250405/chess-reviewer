import os


from celery import Celery
from celery import signals


# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

# Get broker URL from environment variable or use default
broker_url = os.environ.get("CELERY_BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")

app = Celery("app", broker=broker_url)
app.conf.broker_transport_options = {"visibility_timeout": 360000}
app.conf.broker_transport_options = {"heartbeat": 0}
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")


# Load task modules from all registered Django apps.
app.autodiscover_tasks()
