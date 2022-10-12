from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscriptions = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='signed_users')
    ignored_users = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='banned_users')

    class Meta:
        verbose_name = 'profile'
        verbose_name_plural = 'profiles'

    def __str__(self):
        return self.user.username


class Video(models.Model):
    upload = models.FileField(upload_to='uploads/')
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    header = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        verbose_name = 'video'
        verbose_name_plural = 'videos'

    def __str__(self):
        return self.header

    def get_likes_count(self):
        return Like.objects.filter(video=self).count()


class Comment(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    text = models.CharField(max_length=512)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'comment'
        verbose_name_plural = 'comments'

    def __str__(self):
        return self.author.user.username + ": " + self.text


class Like(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'like'
        verbose_name_plural = 'likes'
        constraints = [models.UniqueConstraint(fields=['video', 'user'], name='unique_like')]

    def __str__(self):
        return self.user.user.username + " liked " + self.video.header
