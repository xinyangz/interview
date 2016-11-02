from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import jsonschema
from .schemas import swagger_schema
from . import permissions
from . import sequences


room_keys = ('id', 'name', 'logo', 'interviewer', 'candidates', 'problems')


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
        return_list = list(map(lambda x: {k: v for k, v in dict(x).items() if k in room_keys},
                           list(sorted_rooms)))
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

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check existence
    room_id = int(room_id)
    room_cursor = db.rooms.find({'id': room_id})
    if room_cursor.count() == 0:
        return Response(
            {
                'error': 'Room not found.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif room_cursor.count() > 1:
        return Response(
            {
                'error': 'Room id duplicated'
            },
            status.HTTP_400_BAD_REQUEST
        )

    room_data = dict(room_cursor[0])
    del room_data['_id']

    # TODO: request.data


@api_view(['DELETE', 'GET', 'PUT'])
def manage(request, room_id, **kwargs):
    permitted_user_types = ['hr', 'interviewer']

    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check existence
    room_id = int(room_id)
    room_cursor = db.rooms.find({'id': room_id})
    if room_cursor.count() == 0:
        return Response(
            {
                'error': 'Room not found.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif room_cursor.count() > 1:
        return Response(
            {
                'error': 'Room id duplicated'
            },
            status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'DELETE':
        db.rooms.delete_one({'id': room_id})
        return Response(status=status.HTTP_200_OK)

    if request.method == 'GET':
        ret_data = {k: v for k, v in dict(room_cursor[0]).items() if k in room_keys}
        return Response(
            ret_data,
            status.HTTP_200_OK
        )

    if request.method == 'PUT':
        room_data_full = {k: v for k, v in dict(room_cursor[0]).items() if k in room_keys}
        update_data = dict(request.data)

        # Schema check
        try:
            jsonschema.validate(update_data, swagger_schema['definitions']['RoomPost'])
        except:
            return Response(
                {'error': 'Key error'},
                status.HTTP_400_BAD_REQUEST
            )

        db.rooms.update_one(
            {'id': room_id},
            {'$set': update_data}
        )

        for k, v in update_data.items():
            room_data_full[k] = v

        return Response(
            room_data_full,
            status.HTTP_200_OK
        )
