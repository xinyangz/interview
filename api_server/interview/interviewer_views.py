from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
from . import permissions


@api_view(['GET'])
def root(request, **kwargs):
    permitted_user_types = ['interviewer']

    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    token = request.GET.get('token')
    cursor = db.users.find({'token': token})

    room_cursor = db.rooms.find({'interviewer': cursor[0]['username']})

    if room_cursor.count() == 0:
        return Response(
            {
                'error': 'No room found.'
            },
            status.HTTP_400_BAD_REQUEST
        )

    room_id = room_cursor[0]['id']
    return Response(
        {'roomId': room_id},
        status.HTTP_200_OK
    )
