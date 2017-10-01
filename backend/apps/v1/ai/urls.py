from django.conf.urls import url
from .views import AiView


urlpatterns = [
    url(r'^ai$', AiView.as_view()),
]
