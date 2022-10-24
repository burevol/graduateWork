from django.db import models
from videosrv.models import Profile


# Create your models here.
class Message(models.Model):
    user_from = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='message_user_from')
    user_to = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='message_user_to')
    message = models.CharField(max_length=512)
    read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.message}'


class Room(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.name}'

