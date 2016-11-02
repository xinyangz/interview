from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import jsonschema
from .schemas import swagger_schema
from . import permissions
from . import sequences


room_keys = ('id', 'logo', 'interviewer', 'candidates', 'problems')


@api_view(['GET', 'POST'])
def root(request, **kwargs):
    permitted_user_types = ['hr']

    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    if request.method == 'POST':
        room_data = dict(request.data)

        try:
            jsonschema.validate(room_data, swagger_schema['definitions']['RoomPost'])
        except:
            return Response(
                {'error': 'Key error'},
                status.HTTP_400_BAD_REQUEST
            )

        room_id = sequences.get_next_sequence('room_id')
        room_data['id'] = room_id
        room_data['problems'] = []

        client = pymongo.MongoClient()
        db = client[settings.DB_NAME]
        db.rooms.insert_one(room_data)

        del room_data['_id']
        return Response(
            room_data,
            status.HTTP_200_OK
        )

    if request.method == 'GET':
        client = pymongo.MongoClient()
        db = client[settings.DB_NAME]

        offset = request.GET.get('offset')
        limit = request.GET.get('limit')
        if offset is None or offset == '':
            offset = 0
        else:
            offset = int(offset)

        if limit is None or limit == '':
            limit = 1
        else:
            limit = int(limit)

        sorted_rooms = db.rooms.find(
            {
                'id': {'$gte': offset + 1, '$lte': offset + limit}
            }
        ).sort('id', pymongo.ASCENDING)
        count = sorted_rooms.count()
        return_list = map(lambda x: {k: v for k, v in dict(x).items() if k in room_keys},
                          list(sorted_rooms))
        return Response(
            {
                'offset': offset,
                'limit': limit,
                'count': count,
                'rooms': return_list
            },
            status.HTTP_200_OK
        )


@api_view(['PUT'])
def logo(request, room_id, **kwargs):
    permitted_user_types = ['hr', 'interviewer']

    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    room_id = int(room_id)
