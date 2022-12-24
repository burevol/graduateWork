from rest_framework import serializers
from .models import Message
from videosrv.serializers import ProfileSerializer


class MessageSerializer(serializers.ModelSerializer):
    user_from = ProfileSerializer
    user_to = ProfileSerializer

    class Meta:
        model = Message
        fields = ['pk', 'user_from', 'user_to', 'message', 'date']
