# Generated by Django 4.2.2 on 2023-08-01 12:32

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("audio_player", "0010_alter_userprofile_profile_pic"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="comment",
            options={"ordering": ["-date_created"]},
        ),
    ]
