# Generated by Django 4.2.2 on 2023-07-26 19:08

from django.db import migrations
import django_resized.forms


class Migration(migrations.Migration):
    dependencies = [
        ("audio_player", "0009_alter_userprofile_profile_pic"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="profile_pic",
            field=django_resized.forms.ResizedImageField(
                crop=["middle", "center"],
                default="profile_pics/default.jpg",
                force_format=None,
                keep_meta=True,
                quality=-1,
                scale=None,
                size=[100, 100],
                upload_to="profile_pics",
            ),
        ),
    ]
