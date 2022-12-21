from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.db import transaction
from .models import Profile, Video, Comment, Like


class ProfileSerializer(RegisterSerializer):
    phone_number = serializers.CharField(max_length=30)
    avatar = serializers.FileField(required=False, max_length=255)

    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.phone_number = self.data.get('phone_number')
        user.avatar = self.data.get('avatar')
        user.save()
        return user


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['username', 'subscriptions']



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['username', 'phone_number', 'email', 'avatar']


class VideoSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    extra_kwargs = {'author': {'required': False}}
    author_name = serializers.CharField(source='author.username', required=False)

    class Meta:
        model = Video
        fields = ['id', 'upload', 'preview', 'author', 'author_name', 'date_added', 'header', 'description',
                  'likes_count']

    def get_likes_count(self, obj):
        return obj.get_likes_count()


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', required=False)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_name', 'video', 'text', 'date_added']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['video', 'user', 'date']
