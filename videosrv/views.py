from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.generics import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Profile, Video, Comment, Like
from .serializers import ProfileSerializer, VideoSerializer, CommentSerializer, LikeSerializer


class IsOwnerStuffOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS \
                or request.user.is_staff:
            return True
        if request.user.is_anonymous:
            return False
        profile = Profile.objects.get(user=request.user)
        return obj.author == profile


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['author', ]
    search_fields = ['header', 'description']


class UploadViewSet(CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            author = get_object_or_404(Profile, user=self.request.user)
            return serializer.save(author=author)
        else:
            raise ValidationError('Некорректный пользователь')


class VideoByUserViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        try:
            profile = Profile.objects.get(user_id=user_id)
        except ObjectDoesNotExist:
            return Video.objects.none()
        if user_id is not None:
            return Video.objects.filter(author=profile)
        else:
            return Video.objects.none()


class SubscriptionsViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user)
            return Video.objects.filter(author__in=profile.subscriptions.all())
        else:
            return Video.objects.none()


class CommentsViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]

    def get_queryset(self):
        video_id = self.request.query_params.get('video_id')
        if video_id is not None:
            return Comment.objects.filter(video_id=video_id)
        else:
            return Comment.objects.none()


class LikeView(APIView):
    def get(self, request):
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user)
            video_id = self.request.query_params.get('video_id')
            if video_id is not None:
                try:
                    video = Video.objects.get(id=video_id)
                except ObjectDoesNotExist:
                    return Response("Video not found", status=status.HTTP_400_BAD_REQUEST)
                try:
                    Like.objects.create(video=video, user=profile)
                except IntegrityError:
                    return Response("Like already appended", status=status.HTTP_406_NOT_ACCEPTABLE)
                return Response('Like successfully added', status=status.HTTP_201_CREATED)
            else:
                return Response("Video not found", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfileUpdateView(UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]


class UserToProfile(APIView):
    def get(self, request):
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            try:
                id = Response(str(Profile.objects.get(user_id=user_id).id), status=status.HTTP_200_OK)
            except ObjectDoesNotExist:
                return Response("Profile not found", status=status.HTTP_400_BAD_REQUEST)
            return id
        else:
            return Response("Profile not found", status=status.HTTP_400_BAD_REQUEST)
