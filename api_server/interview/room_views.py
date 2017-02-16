from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import os
import jsonschema
import uuid
import imghdr
from .schemas import swagger_schema
from . import permissions
from . import sequences
from . import send_email


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
            jsonschema.validate(room_data,
                                swagger_schema['definitions']['RoomPost'])
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

        # Create user for interviewer
        temp_username = "Interviewer_" + \
            str(sequences.get_next_sequence('interviewer'))
        while db.users.find({'username': temp_username}).count() > 0:
            temp_username = "Interviewer_" + \
                str(sequences.get_next_sequence('interviewer'))
        temp_password = str(uuid.uuid4())
        user_part = {
            'username': temp_username,
            'type': 'interviewer',
            'email': room_data['interviewer'],
            'password': temp_password,
            'organization': 'Interviewer Group',
        }
        db.users.insert_one(user_part)

        room_data['interviewer'] = temp_username
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

        sorted_rooms = db.rooms.find({}).sort('id', pymongo.ASCENDING)
        all_count = sorted_rooms.count()
        if offset + limit > all_count:
            count = all_count - offset
        else:
            count = limit
        sorted_rooms = list(sorted_rooms)[offset:offset + count]
        return_list = list(map(
            lambda x: {k: v for k, v in dict(x).items()
                       if k in room_keys},
            sorted_rooms))
        return Response(
            {
                'offset': offset,
                'limit': limit,
                'count': count,
                'rooms': return_list
            },
            status.HTTP_200_OK
        )


@api_view(['GET'])
def invitation(request, room_id, **kwargs):
    permitted_user_types = ['hr']
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

    room_data = room_cursor[0]
    interviewer_username = room_data['interviewer']
    interviewer_cursor = db.users.find({'username': interviewer_username})
    if interviewer_cursor.count() == 0:
        return Response(
            {
                'error': 'Interviewer not found'
            },
            status.HTTP_400_BAD_REQUEST
        )
    interviewer_email_lr = (interviewer_cursor[0]['email'],
                            interviewer_cursor[0]['username'],
                            interviewer_cursor[0]['password'])
    candidate_email_lrs = []
    if 'candidates' in room_data:
        for candidate_id in room_data['candidates']:
            candidate_cursor = db.candidate.find({'id': candidate_id})
            if candidate_cursor.count() == 0:
                return Response(
                    {
                        'error': 'Candidate not found'
                    },
                    status.HTTP_400_BAD_REQUEST
                )
            candidate_username = candidate_cursor[0]['unique_username']
            candidate_email_lrs.append(
                (candidate_cursor[0]['email'],
                 candidate_username,
                 db.users.find(
                     {'username': candidate_username})[0]['password']
                 )
            )

    send_email.send_interviewer_invitation(
        interviewer_email_lr[0],
        interviewer_email_lr[1],
        interviewer_email_lr[2])
    for candidate_email_lr in candidate_email_lrs:
        send_email.send_candidate_invitation(
            candidate_email_lr[0],
            candidate_email_lr[1],
            candidate_email_lr[2])

    return Response(status=status.HTTP_200_OK)


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

    # Save logo
    try:
        img_file = request.data['image']
        _, extension = os.path.splitext(img_file.name)
        if imghdr.what(img_file.file) is None:
            raise Exception
    except:
        return Response(
            {
                'error': 'Invalid image file'
            },
            status.HTTP_400_BAD_REQUEST
        )

    file_path = os.path.join(settings.FILE_ROOT, str(room_id),
                             'logo' + extension)
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))
    with open(file_path, 'wb+') as destination:
        for chunk in img_file.chunks():
            destination.write(chunk)

    # update logo url
    logo_url = settings.SITE_URL + settings.FILE_URL + str(room_id) + \
        '/logo' + extension
    db.rooms.update_one(
        {'id': room_id},
        {'$set': {'logo': logo_url}}
    )
    room_data['logo'] = logo_url

    return Response(
        room_data,
        status.HTTP_200_OK
    )


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
        candidate_ids = room_cursor[0]['candidates']
        for candidate_id in candidate_ids:
            db.candidate.update(
                {'id': candidate_id}, {'$unset': {'roomId': 1}}
            )
        db.rooms.delete_one({'id': room_id})
        return Response(status=status.HTTP_200_OK)

    if request.method == 'GET':
        ret_data = {
            k: v for k, v in dict(room_cursor[0]).items() if k in room_keys
        }
        return Response(
            ret_data,
            status.HTTP_200_OK
        )

    if request.method == 'PUT':
        room_data_full = {
            k: v for k, v in dict(room_cursor[0]).items() if k in room_keys
        }
        update_data = dict(request.data)

        # Schema check
        try:
            jsonschema.validate(
                update_data,
                swagger_schema['definitions']['RoomPost']
             )
        except:
            return Response(
                {'error': 'Key error'},
                status.HTTP_400_BAD_REQUEST
            )

        cursor = db.rooms.find({'id': room_id})
        if cursor.count() == 0:
            return Response(
                {'error': 'Room not found'},
                status.HTTP_404_NOT_FOUND
            )

        # Check if interviewer is changed
        username_email = update_data['interviewer']
        user_cursor = db.users.find({'username': username_email})
        if user_cursor.count() == 0 or user_cursor[0]['type'] != 'interviewer':
            interviewer_username = cursor[0]['interviewer']
            user_cursor = db.users.find({'username': interviewer_username})
            if user_cursor.count() == 0:
                return Response(
                    {'error': 'Interviewer not found'},
                    status.HTTP_404_NOT_FOUND
                )
            if username_email != user_cursor[0]['email']:
                temp_username = "Interviewer_" + \
                    str(sequences.get_next_sequence('interviewer'))
                while db.users.find({'username': temp_username}).count() > 0:
                    temp_username = "Interviewer_" + \
                        str(sequences.get_next_sequence('interviewer'))
                temp_password = str(uuid.uuid4())
                user_part = {
                    'username': temp_username,
                    'type': 'interviewer',
                    'email': username_email,
                    'password': temp_password,
                    'organization': 'Interviewer Group',
                }
                db.users.insert_one(user_part)
                update_data['interviewer'] = temp_username

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
