from django.conf.urls import url, include
from . import user_views
from . import candidate_views
from . import report_views
from . import room_views
from . import interviewer_views
from . import problem_views

api_patterns = [
    url(r'^user/login$',
        user_views.user_login, name='user-login'),
    url(r'^user/logout$',
        user_views.user_logout, name='user-logout'),
    url(r'^user/register$',
        user_views.user_register, name='user-register'),
    url(r'^user/(?P<username>([^/]+))$',
        user_views.user_manage, name='user-manage'),
    url(r'^candidate$',
        candidate_views.get_set_candidate, name='get-set-candidate'),
    url(r'^candidate/(?P<candidate_id>([0-9]+))$',
        candidate_views.workon_candidate, name='workon-candidate'),
    url(r'^candidate/(?P<candidate_id>([0-9]+))/status$',
        candidate_views.change_status_candidate, name='status-candidate'),
    url(r'^candidate/room/(?P<candidate_id>([0-9]+))$',
        candidate_views.get_room_candidate, name='room-candidate'),
    url(r'^candidate/file$',
        candidate_views.batch_candidate, name='batch-candidate'),
    url(r'^report/(?P<candidate_id>([0-9]+))$',
        report_views.all_report, name='put-report'),
    url(r'^room$',
        room_views.root, name='room-root'),
    url(r'^room/(?P<room_id>([0-9]+))/logo$',
        room_views.logo, name='room-logo'),
    url(r'^room/(?P<room_id>([0-9]+))/invitation$',
        room_views.invitation, name='room-invitation'),
    url(r'^room/(?P<room_id>([0-9]+))$',
        room_views.manage, name='room-manage'),
    url(r'^interviewer$',
        interviewer_views.root, name='interviewer-roomId'),
    url(r'^problem/room/(?P<room_id>([0-9]+))$',
        problem_views.root, name='problem-root'),
    url(r'^problem/(?P<problem_id>([0-9]+))$',
        problem_views.manage, name='problem-manage')
]

urlpatterns = [
    url(r'^api/(?P<version>(v\d+))/', include(api_patterns)),
]
