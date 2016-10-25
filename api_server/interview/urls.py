from django.conf.urls import url, include
from . import user_views

api_patterns = [
    url(r'^user/login$', user_views.user_login, name='user-login'),
    url(r'^user/logout$', user_views.user_logout, name='user-logout'),
    url(r'^user/register$', user_views.user_register, name='user-register'),
]

urlpatterns = [
    url(r'^(?P<version>(v\d+))/', include(api_patterns)),
]
