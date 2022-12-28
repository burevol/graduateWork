from celery import shared_task
from celery.utils.log import get_task_logger
from django.apps import apps
from django.db.models import Count
from django.core.mail import send_mail
from django.conf import settings

logger = get_task_logger(__name__)


@shared_task
def hello():
    logger.info("The sample task just ran.")


@shared_task
def send_messages():
    pass
    model = apps.get_model(app_label='messenger', model_name='Message')
    for email, count in model.objects.filter(read=False).values('user_to__email').annotate(
            total=Count('pk')).values_list('user_to__email', 'total'):
        send_mail(
            subject=f'У вас {count} непрочитанных сообщений',
            message=f'У вас {count} непрочитанных сообщений',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
