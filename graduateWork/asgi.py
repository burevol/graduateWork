"""
ASGI config for graduateWork project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from messenger.routing import websocket_urlpatterns
from messenger.token_auth import TokenAuthMiddlewareStack
from messenger.channelsmiddleware import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'graduateWork.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket': TokenAuthMiddleware(
        URLRouter(websocket_urlpatterns))
})
