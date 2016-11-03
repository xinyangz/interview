from django.conf.urls import url, include
from . import views
from . import report_views

api_patterns = [
    url(r'^user/login$', views.user_login, name='user-login'),
    url(r'^user/logout$', views.user_logout, name='user-logout'),
    url(r'^user/register$', views.user_register, name='user-register'),
    url(r'^report/(?P<candidate_id>([0-9]+))$', report_views.all_report, name='put-report'),
]

urlpatterns = [
    url(r'^(?P<version>(v\d+))/', include(api_patterns)),
]
