from django.test import TestCase
from videosrv.models import Profile, Video, Comment, Like
from django.contrib.auth.models import User
from django.db.utils import IntegrityError


# Create your tests here.

class ModelsTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username='user1')
        User.objects.create_user(username='user2')

    def test_create_profiles(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        self.assertEqual(str(user1_profile), 'user1')
        self.assertEqual(str(user2_profile), 'user2')

    def test_create_video(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        video1 = Video.objects.create(author=user1_profile, header='video1', description='video1 description')
        video2 = Video.objects.create(author=user2_profile, header='video2', description='video2 description')

        self.assertEqual(str(video1), 'video1')
        self.assertEqual(str(video2), 'video2')

    def test_create_comment(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        video1 = Video.objects.create(author=user1_profile, header='video1', description='video1 description')
        video2 = Video.objects.create(author=user2_profile, header='video2', description='video2 description')

        Comment.objects.create(author=user1_profile, video=video1, text='comment1')
        Comment.objects.create(author=user2_profile, video=video2, text='comment2')

    def test_like(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        video1 = Video.objects.create(author=user1_profile, header='video1', description='video1 description')
        video2 = Video.objects.create(author=user2_profile, header='video2', description='video2 description')

        like1 = Like.objects.create(video=video1, user=user1_profile)
        like2 = Like.objects.create(video=video2, user=user2_profile)

    def test_subscriptions(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        user1_profile.subscriptions.add(user2_profile)
        self.assertEqual(user1_profile.subscriptions.count(), 1)

    def test_ignore(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        user1_profile.ignored_users.add(user2_profile)

        self.assertEqual(user1_profile.ignored_users.count(), 1)

    def test_unique_like(self):
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        user1_profile = Profile.objects.create(user=user1)
        user2_profile = Profile.objects.create(user=user2)

        video1 = Video.objects.create(author=user1_profile, header='video1', description='video1 description')

        like1 = Like.objects.create(video=video1, user=user1_profile)
        with self.assertRaises(IntegrityError):
            like2 = Like.objects.create(video=video1, user=user1_profile)
