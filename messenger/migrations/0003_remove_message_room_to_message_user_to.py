# Generated by Django 4.1.1 on 2022-12-24 13:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('messenger', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='room_to',
        ),
        migrations.AddField(
            model_name='message',
            name='user_to',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='message_user_to', to=settings.AUTH_USER_MODEL),
        ),
    ]