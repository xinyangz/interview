from django.conf.urls import url
from . import views

urlpatterns = [
    # url(r'^test/$', views.test),
    url(r'^user/login$', views.user_login, name='user-login'),
    url(r'^user/logout$', views.user_logout, name='user-logout'),
]
