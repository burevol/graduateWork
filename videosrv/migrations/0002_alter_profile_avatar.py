# Generated by Django 4.1.1 on 2022-12-21 15:48

from django.db import migrations, models
import videosrv.models


class Migration(migrations.Migration):

    dependencies = [
        ('videosrv', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.FileField(blank=True, max_length=255, upload_to=videosrv.models.uuid_path),
        ),
    ]
