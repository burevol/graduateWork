from django.apps import AppConfig


class VideosrvConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'videosrv'

    def ready(self):
        import videosrv.signals
