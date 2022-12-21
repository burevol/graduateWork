from django.urls import include, path
from rest_framework import routers
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

from .views import VideoViewSet, VideoByUserViewSet, SubscriptionsViewSet, CommentsViewSet, ProfileView, \
    ProfileUpdateView, UploadViewSet, LikeView, UpdateViewSet, SubscribeView, IgnoreView, UnSubscribeView

router = routers.DefaultRouter()
router.register(r'video', VideoViewSet)
router.register(r'video_by_user', VideoByUserViewSet, basename='video_by_user')
router.register(r'subscriptions', SubscriptionsViewSet, basename='subscription')
router.register(r'comments', CommentsViewSet, basename='comments')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/user/<int:pk>', ProfileView.as_view(), name='user'),
    path('api/user_update/<int:pk>', ProfileUpdateView.as_view(), name='user'),
    path('api/upload/', UploadViewSet.as_view()),
    path('api/update/<int:pk>', UpdateViewSet.as_view()),
    path('api/like/', LikeView.as_view()),
    path('api/subscribe/', SubscribeView.as_view()),
    path('api/unsubscribe/', UnSubscribeView.as_view()),
    path('api/ignore/', IgnoreView.as_view()),
    path('password-reset/', PasswordResetView.as_view()),
    path('password-reset-confirm/<uidb64>/<token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
