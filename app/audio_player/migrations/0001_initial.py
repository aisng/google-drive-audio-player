# Generated by Django 4.2.2 on 2023-07-17 14:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Song",
            fields=[
                (
                    "id",
                    models.CharField(max_length=100, primary_key=True, serialize=False),
                ),
                ("title", models.CharField(max_length=150, verbose_name="Title")),
            ],
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Comment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "body",
                    models.TextField(
                        help_text="Comment body", max_length=1000, verbose_name="Body"
                    ),
                ),
                (
                    "timestamp",
                    models.CharField(
                        blank=True, max_length=5, null=True, verbose_name="Timestamp"
                    ),
                ),
                (
                    "date_created",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created at"),
                ),
                (
                    "date_updated",
                    models.DateTimeField(auto_now=True, verbose_name="Updated at"),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        default="deleted",
                        null=True,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="replies",
                        to="audio_player.comment",
                    ),
                ),
                (
                    "song",
                    models.ForeignKey(
                        default="deleted",
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        to="audio_player.song",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        default="deleted",
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
