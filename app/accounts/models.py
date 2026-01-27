from django.db import models
from django.contrib.auth.models import User
from django_resized import ResizedImageField


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_pic = ResizedImageField(
        size=[100, 100],
        crop=["middle", "center"],
        upload_to="profile_pics",
        default="profile_pics/default.jpg",
    )

    def __str__(self):
        return self.user.username
