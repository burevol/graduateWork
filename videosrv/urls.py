from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from .views import VideoViewSet, VideoByUserViewSet, SubscriptionsViewSet, CommentsViewSet

router = routers.DefaultRouter()
router.register(r'video', VideoViewSet)
router.register(r'video_by_user', VideoByUserViewSet, basename='video_by_user')
router.register(r'subscription', SubscriptionsViewSet, basename='subscription')
router.register(r'comments', CommentsViewSet, basename='comments')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/auth-token/', obtain_auth_token, name='rest_auth_token'),
]
