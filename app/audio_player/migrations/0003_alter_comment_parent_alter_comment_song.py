# Generated by Django 4.2.2 on 2023-07-21 15:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("audio_player", "0002_alter_comment_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="parent",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_DEFAULT,
                related_name="replies",
                to="audio_player.comment",
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="song",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.SET_DEFAULT,
                to="audio_player.song",
            ),
        ),
    ]
