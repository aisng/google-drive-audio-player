# Generated by Django 4.2.2 on 2023-08-07 12:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('audio_player', '0011_alter_comment_options'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='date_updated',
        ),
    ]
