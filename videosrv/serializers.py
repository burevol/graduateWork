from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Video, Comment, Like


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar']


class VideoSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'upload', 'preview', 'author', 'date_added', 'header', 'description', 'likes_count']

    def get_likes_count(self, obj):
        return obj.get_likes_count()


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'video', 'text', 'date_added']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['video', 'user', 'date']
