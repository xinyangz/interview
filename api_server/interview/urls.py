from django.conf.urls import url, include
from . import user_views
from . import candidate_views

api_patterns = [
    url(r'^user/login$', user_views.user_login, name='user-login'),
    url(r'^user/logout$', user_views.user_logout, name='user-logout'),
    url(r'^user/register$', user_views.user_register, name='user-register'),
    url(r'^user/(?P<username>([^/]+))$', user_views.user_manage, name='user-manage'),
    url(r'^candidate$', candidate_views.get_set_candidate, name='get-set-candidate'),
    url(r'^candidate/(?P<candidate_id>([0-9]+))$', candidate_views.workon_candidate, name='workon-candidate'),
    url(r'^candidate/(?P<candidate_id>([0-9]+))/status$', candidate_views.change_status_candidate, name='status-candidate'),
]

urlpatterns = [
    url(r'^(?P<version>(v\d+))/', include(api_patterns)),
]
