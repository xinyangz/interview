from django.conf.urls import url, include
from . import views

api_patterns = [
    url(r'^test/$', views.test),
]

urlpatterns = [
    url(r'^(?P<version>(v\d+))/', include(api_patterns)),
]
