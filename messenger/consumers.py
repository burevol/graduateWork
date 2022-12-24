import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from asgiref.sync import sync_to_async
from videosrv.models import Profile
from .models import Message, Room
from .serializers import MessageSerializer
from videosrv.serializers import ProfileSerializer


class MessengerConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.username = None
        self.user = None
        self.user_inbox = None
        self.room_name = None

    async def connect(self):
        """Connect user to consumer. Check authentication, create private group and add to broadcast group"""

        if self.scope['user'].is_authenticated:
            await self.accept()
            self.username = self.scope['user'].username
            self.user_inbox = f'inbox_{self.scope["user"].username}'
            self.user = self.scope['user']
            await self.channel_layer.group_add(
                self.user_inbox,
                self.channel_name
            )
            await self.channel_layer.group_add(
                'all-users',
                self.channel_name
            )
        else:
            await self.close(code=401)

    async def disconnect(self, code):
        """Remove user from private group and broadcast group, send to group message 'user_leave'"""
        if self.user_inbox is not None:
            await self.channel_layer.group_discard(
                self.user_inbox,
                self.channel_name
            )
            await self.channel_layer.group_discard(
                'all-users',
                self.channel_name
            )
        if self.room_name is not None:
            await self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None):
        """Receive message from user"""
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        command = text_data_json['command']

        if command == 'message':
            if self.room_name is not None:
                user_to = await self.get_user_profile(text_data_json['user_to'])
                message_json = await self.save_message(user_from=self.scope['user'], user_to=user_to, message=message)
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        'type': 'message',
                        'user': self.username,
                        'message': message_json
                    }
                )

        elif command == 'enter_private':
            await self.leave_room()
            username = await self.get_user_name(message)
            self.room_name = f'inbox_{username}'
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )

        elif command == 'get_messages':
            user2 = await self.get_user_profile(message)
            messages = await self.get_messages(self.user, user2)
            await self.channel_layer.group_send(
                self.user_inbox,
                {
                    'type': 'message_history',
                    'user': self.username,
                    'message': messages
                }
            )
        elif command == 'get_users':
            users = await self.get_users(self.user)
            await self.send(json.dumps({
                'type': 'users',
                'user': self.username,
                'message': json.dumps(users)
            }))

    async def leave_room(self):
        """Leave current room"""
        if self.room_name is not None:
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': 'user_leave',
                    'user': self.username
                }
            )
            await self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            )
            self.room_name = None

    async def message(self, event):
        await self.send(text_data=json.dumps(event))

    async def update_rooms(self, event):
        await self.send(text_data=json.dumps(event))

    async def update_profiles(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_join(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_leave(self, event):
        await self.send(text_data=json.dumps(event))

    async def message_history(self, event):
        await self.send(text_data=json.dumps(event))

    async def users(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_user_name(self, user_id):
        return Profile.objects.get(pk=int(user_id)).username

    @database_sync_to_async
    def save_message(self, user_from, user_to, message):
        new_message = Message.objects.create(user_from=user_from, user_to=user_to, message=message, read=False)
        serializer = MessageSerializer(new_message)
        return serializer.data

    @database_sync_to_async
    def save_room(self, name):
        if not Room.objects.filter(name__exact=name).exists():
            Room.objects.create(name=name)

    @database_sync_to_async
    def get_messages(self, user1, user2):
        messages = Message.objects.filter(
            Q(user_from=user1, user_to=user2) | Q(user_from=user2, user_to=user1)).order_by(
            'date')

        serializer = MessageSerializer(messages, many=True)
        return serializer.data

    @database_sync_to_async
    def get_user_profile(self, user_id):
        return Profile.objects.get(pk=user_id)

    @database_sync_to_async
    def get_users(self, user):
        users_to = Message.objects.filter(user_from=user).values_list("user_to", "user_to__username").distinct()
        users_from = Message.objects.filter(user_to=user).values_list("user_from", "user_from__username").distinct()
        users = users_to.union(users_from)
        return list(users)
