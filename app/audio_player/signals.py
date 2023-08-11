from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_out, user_logged_in
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.contrib import messages

from .models import UserProfile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()


def show_logout_message(sender, user, request, **kwargs):
    messages.info(request, "You have been logged out.")


user_logged_out.connect(show_logout_message)


def show_login_message(sender, user, request, **kwargs):
    messages.info(request, f"You're logged in as {user}.")


user_logged_in.connect(show_login_message)
