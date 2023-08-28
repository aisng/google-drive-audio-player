from django.apps import AppConfig


class AudioPlayerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "audio_player"

    def ready(self):
        from .signals import create_profile, save_profile, delete_user
