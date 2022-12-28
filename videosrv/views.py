import json
from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.generics import get_object_or_404
from django.core.exceptions import ValidationError
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.views.decorators.csrf import csrf_exempt
from webpush_drf import send_user_notification
from dj_rest_auth.registration.views import SocialLoginView
from .models import Profile, Video, Comment, Like
from .serializers import ProfileSerializer, VideoSerializer, CommentSerializer, UserSerializer


class IsOwnerStuffOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS \
                or request.user.is_staff:
            return True
        if request.user.is_anonymous:
            return False
        return obj.author == request.user


class IsAuthorizedUserStuffOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS \
                or request.user.is_staff:
            return True
        if request.user.is_anonymous:
            return False
        return obj == request.user


class GoogleLogin(SocialLoginView):  # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['author', ]
    search_fields = ['header', 'description']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated:
            try:
                profile = Profile.objects.get(pk=self.request.user.id)
            except ObjectDoesNotExist:
                return Video.objects.none()
            return Video.objects.exclude(author__in=profile.ignored_users.all())
        else:
            return Video.objects.all()


class UploadViewSet(CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            author = get_object_or_404(Profile, pk=self.request.user.id)
            return serializer.save(author=author)
        else:
            raise ValidationError('Некорректный пользователь')


class UpdateViewSet(UpdateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerStuffOrReadOnly]


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
            profile = Profile.objects.get(pk=self.request.user.id)
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
            profile = Profile.objects.get(pk=self.request.user.id)
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


class SubscribeView(APIView):
    def post(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            subscribe_to_id = self.request.data['subscribe_to']
            subscribe_to = Profile.objects.get(pk=subscribe_to_id)
            profile.subscriptions.add(subscribe_to)
            return Response('Subscription successfully added', status=status.HTTP_201_CREATED)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            subscriptions = [user.pk for user in profile.subscriptions.all()]
            return Response(subscriptions)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)


class UnSubscribeView(APIView):
    def post(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            unsubscribe_to_id = self.request.data['subscribe_to']
            unsubscribe_to = Profile.objects.get(pk=unsubscribe_to_id)
            profile.subscriptions.remove(unsubscribe_to)
            return Response('Subscription successfully removed', status=status.HTTP_201_CREATED)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)


class BanView(APIView):
    def post(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            ban_to_id = self.request.data['ban_to']
            ban_to = Profile.objects.get(pk=ban_to_id)
            profile.ignored_users.add(ban_to)
            return Response('Ban successfully added', status=status.HTTP_201_CREATED)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            banned_users = [user.pk for user in profile.ignored_users.all()]
            return Response(banned_users)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)


class UnBanView(APIView):
    def post(self, request):
        if self.request.user.is_authenticated:
            profile = get_object_or_404(Profile, pk=self.request.user.id)
            unban_to_id = self.request.data['ban_to']
            unban_to = Profile.objects.get(pk=unban_to_id)
            profile.ignored_users.remove(unban_to)
            return Response('Ban successfully removed', status=status.HTTP_201_CREATED)
        else:
            return Response("User not authorized", status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer


class ProfileUpdateView(UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthorizedUserStuffOrReadOnly]


@require_POST
@csrf_exempt
def send_push(request):
    try:
        body = request.body
        data = json.loads(body)

        if 'head' not in data or 'body' not in data or 'id' not in data:
            return JsonResponse(status=400, data={"message": "Invalid data format"})

        user_id = data['id']
        user = get_object_or_404(Profile, pk=user_id)
        payload = {'head': data['head'], 'body': data['body']}
        send_user_notification(user=user, payload=payload, ttl=1000)

        return JsonResponse(status=200, data={"message": "Web push successful"})
    except TypeError:
        return JsonResponse(status=500, data={"message": "An error occurred"})
