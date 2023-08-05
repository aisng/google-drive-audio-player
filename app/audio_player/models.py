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


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="replies",
    )
    song = models.ForeignKey(
        "Song", on_delete=models.SET_NULL, null=True, blank=True, to_field="id"
    )
    body = models.TextField("Body", max_length=1000, help_text="Comment body")
    timestamp = models.CharField("Timestamp", max_length=5, null=True, blank=True)
    date_created = models.DateTimeField("Created at", auto_now_add=True)

    class Meta:
        ordering = ["-date_created"]

    def __str__(self):
        return f"{self.body}" if len(self.body) < 30 else f"{self.body}"

    def get_replies(self):
        return self.replies.all()


class Song(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    title = models.CharField("Title", max_length=150)
