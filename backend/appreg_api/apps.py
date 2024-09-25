# apps.py
from django.apps import AppConfig

class AppregApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'appreg_api'

    def ready(self):
        import appreg_api.signals
