from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import uuid
import jsonschema
from . import permissions
from . import sequences
from .schemas import swagger_schema
from .file_parser import file_parser


candidate_keys = ('id', 'name', 'email', 'phone', 'status', 'roomId', 'record')


@api_view(['POST', 'GET'])
def get_set_candidate(request, **kwargs):
    '''
    'id': 3001,
    'name': 'Mike',
    'email': 'example@example.com',
    'phone': '1300000000',
    'status': 'weimianshi',
    'roomId': 1001,
    'record':{
        'video': 'string',
        'board': 'string',
        'chat' : 'string',
        'code' : 'string',
        'report':'string'
    }
    '''

    # Check user permission
    if permissions.check(request, ['hr']) != permissions.PASS:
        return Response(
            {
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    if request.method == 'POST':
        candidate_data = request.data

        # Check key error
        try:
            jsonschema.validate(candidate_data,
                                swagger_schema['definitions']['PostCandidate'])
        except:
            return Response(
                {
                    'error': 'Key error'
                },
                status.HTTP_400_BAD_REQUEST
            )

        # Add record

        temp_username = "User_" + str(uuid.uuid4())[:8]
        while db.users.find({'username': temp_username}).count() > 0:
            temp_username = "User_" + str(uuid.uuid4())[:8]
        temp_password = str(uuid.uuid4())
        user_part = {
            'username': temp_username,
            'type': 'candidate',
            'email': candidate_data['email'],
            'password': temp_password,
            'organization': 'Candidate Group',
        }
        if 'phone' in candidate_data:
            user_part['contact'] = candidate_data['phone']

        # Generate unique id
        candidate_id = sequences.get_next_sequence('candidate_id')

        candidate_part = candidate_data.copy()
        candidate_part['unique_username'] = temp_username
        candidate_part['id'] = candidate_id

        room_id = candidate_data['roomId']
        room_cursor = db.rooms.find({'id': room_id})
        if room_cursor.count() == 0:
            return Response(
                {'error': "Room doesn't exist"},
                status.HTTP_400_BAD_REQUEST
            )
        room_data = room_cursor[0]['candidates']
        room_data.append(candidate_id)
        db.rooms.update_one(
            {'id': room_id},
            {'$set': {'candidates': room_data}}
        )
        db.users.insert_one(user_part)
        db.candidate.insert_one(candidate_part)
        ret_candidate_part = candidate_data.copy()
        ret_candidate_part['id'] = candidate_id
        return Response(ret_candidate_part, status.HTTP_200_OK)
    elif request.method == 'GET':
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

        sorted_candidate = db.candidate.find({}).sort('id', pymongo.ASCENDING)
        all_count = sorted_candidate.count()
        if offset + limit > all_count:
            count = all_count - offset
        else:
            count = limit
        sorted_candidate = list(sorted_candidate)[offset:offset + count]
        return_list = list(map(
            lambda x: {k: v for k, v in dict(x).items()
                       if k in candidate_keys},
            sorted_candidate))

        return Response(
            {
                'offset': offset,
                'limit': limit,
                'count': count,
                'candidates': return_list
            },
            status.HTTP_200_OK
        )
    else:
        return Response(
            {
                'error': 'Unknown method'
            },
            status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'DELETE', 'PUT'])
def workon_candidate(request, candidate_id, **kwargs):
    # Check user permission
    if permissions.check(request, ('hr', 'interviewer')) != permissions.PASS:
        return Response(
            {
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    candidate_id = int(candidate_id)

    # Check existance
    data = db.candidate.find({'id': candidate_id})
    if data.count() == 0:
        return Response(
            {
                'error': 'Candidate not found.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif data.count() > 1:  # Should never occur
        return Response(
            {
                'error': 'Candidate id duplicated'
            },
            status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'GET':
        # Get data
        for item in data:
            temp_data = {
                k: v for k, v in dict(item).items() if k in candidate_keys
            }
            return Response(
                temp_data,
                status.HTTP_200_OK
            )
    elif request.method == 'PUT':
        # Put data
        original_data = data[0]
        input_data = request.data

        try:
            jsonschema.validate(input_data,
                                swagger_schema['definitions']['Candidate'])
        except:
            return Response(
                {
                    'error': 'Key error'
                },
                status.HTTP_400_BAD_REQUEST
            )

        if input_data['id'] != candidate_id:
            for item in data:
                dulp_list = db.candidate.find({'id': input_data['id']})
                if dulp_list.count() > 0:
                    return Response(
                        {
                            'error':
                                'Trying to generate candidates with same id'
                        },
                        status.HTTP_400_BAD_REQUEST
                    )
        temp_data = {
            k: v for k, v in input_data.items() if k in candidate_keys}

        if 'roomId' not in original_data and 'roomId' in input_data:
            new_room_data_cursor = db.rooms.find({'id': input_data['roomId']})
            if new_room_data_cursor.count() == 0:
                return Response(
                    {'error': "Room id doesn't exist."},
                    status.HTTP_400_BAD_REQUEST
                )
            new_candidate_list = new_room_data_cursor[0]['candidates']
            new_candidate_list.append(candidate_id)
            db.rooms.update_one(
                {'id': input_data['roomId']},
                {'$set': {'candidates': new_candidate_list}}
            )
        elif 'roomId' in original_data and 'roomId' in input_data \
             and original_data['roomId'] != input_data['roomId']:
            original_room_cursor = db.rooms.find(
                {'id': original_data['roomId']}
            )
            new_room_data_cursor = db.rooms.find(
                {'id': input_data['roomId']}
            )
            if original_room_cursor.count() == 0 or \
               new_room_data_cursor.count() == 0:
                return Response(
                    {'error': "Room id doesn't exist."},
                    status.HTTP_400_BAD_REQUEST
                )
            original_candidate_list = original_room_cursor[0]['candidates']
            original_candidate_list.remove(candidate_id)
            new_candidate_list = new_room_data_cursor[0]['candidates']
            new_candidate_list.append(candidate_id)
            db.rooms.update_one(
                {'id': original_data['roomId']},
                {'$set': {'candidates': original_candidate_list}}
            )
            db.rooms.update_one(
                {'id': input_data['roomId']},
                {'$set': {'candidates': new_candidate_list}}
            )

        db.candidate.update_one(
            {'id': candidate_id},
            {
                '$set': temp_data
            }
        )
        return Response(
            input_data,
            status.HTTP_200_OK
        )

    elif request.method == 'DELETE':
        # Delete data
        original_data = data[0]
        if 'roomId' in original_data:
            original_room_cursor = db.rooms.find(
                {'id': original_data['roomId']}
            )
            if original_room_cursor.count() == 0:
                pass
            else:
                original_candidate_list = original_room_cursor[0]['candidates']
                original_candidate_list.remove(candidate_id)
                db.rooms.update_one(
                    {'id': original_data['roomId']},
                    {'$set': {'candidates': original_candidate_list}}
                )

        db.candidate.delete_one({'id': candidate_id})
        return Response(status=status.HTTP_200_OK)

    else:
        return Response(
            {
                'error': 'Unknown request method'
            },
            status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
def change_status_candidate(request, candidate_id, **kwargs):

    new_status = request.GET.get('status')
    # Check key error

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check user permission
    if permissions.check(request, ('hr', 'interviewer')) != permissions.PASS:
        return Response(
            {
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    candidate_id = int(candidate_id)

    candidate = db.candidate.find({'id': candidate_id})
    if candidate.count() == 0:
        return Response(
            {
                'error': 'Candidate not found.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif candidate.count() > 1:
        return Response(
            {
                'error': 'Candidate id duplicated'
            },
            status.HTTP_400_BAD_REQUEST
        )
    else:
        for item in candidate:
            db.candidate.update_one(
                {'id': candidate_id},
                {
                    '$set':
                    {
                        'status': new_status
                    }
                }
            )
            response_dict = {
                k: v for k, v in dict(item).items() if k in candidate_keys}

            return Response(
                response_dict,
                status.HTTP_200_OK
            )


@api_view(['GET', 'POST'])
def batch_candidate(request, **kwargs):
    if permissions.check(request, ('hr', 'interviewer')) != permissions.PASS:
        return Response(
            {
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    if request.method == 'POST':
        if request.FILES is None:
            return Response(
                {
                    'error': "No available file"
                },
                status.HTTP_400_BAD_REQUEST
            )
        file_name = request.FILES['file'].name
        if '.' not in file_name:
            return Response(
                {
                    'error': "Unknown file format"
                },
                status.HTTP_400_BAD_REQUEST
            )
        ext_name = file_name.split('.')[-1]
        file_content = request.FILES['file']

        candidate_list = file_parser(ext_name, file_content)
        if candidate_list is None:
            return Response(
                {
                    'error': "Illegal file format"
                },
                status.HTTP_400_BAD_REQUEST
            )
        for item in candidate_list:
            room_id = item['roomId']
            if room_id is not None and room_id != '' and \
               db.rooms.find({'id': room_id}).count() == 0:
                return Response(
                    {'error': "Room id doesn't exist."},
                    status.HTTP_400_BAD_REQUEST
                )
        for item in candidate_list:
            candidate_to_be_added = item.copy()
            tmp_id = sequences.get_next_sequence('candidate_id')
            candidate_to_be_added['id'] = tmp_id
            print (candidate_to_be_added)
            if 'roomId' in candidate_to_be_added and \
               candidate_to_be_added['roomId'] == '':
                del candidate_to_be_added['roomId']
            print (candidate_to_be_added)
            db.candidate.insert_one(candidate_to_be_added)
            print (candidate_to_be_added)
            room_id = item['roomId']
            if room_id is not None and room_id != '':
                room_candidate_list = db.rooms.find(
                    {'id': room_id}
                )[0]['candidates']
                room_candidate_list.append(tmp_id)
                db.rooms.update_one(
                    {'id': room_id},
                    {'$set': {'candidates': room_candidate_list}}
                )

        return Response(
            status.HTTP_200_OK
        )

    elif request.method == 'GET':
        return Response(
            {
                'csv': settings.SITE_URL + '/file_example/example2.csv',
                'xlsx': settings.SITE_URL + '/file_example/example1.xlsx'
            },
            status.HTTP_200_OK
        )

    else:
        return Response(
            {
                'error': 'No such request type'
            },
            status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def get_room_candidate(request, room_id, **kwargs):
    if permissions.check(request, ('hr', 'interviewer')) != permissions.PASS:
        return Response(
            {
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check room existence
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

    # Get candidates in the room
    candidate_ids = room_cursor[0]['candidates']

    # Get offset and limit
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

    # Calculate count
    candidate_num = len(candidate_ids)
    count = candidate_num if candidate_num <= limit else limit

    candidates = []
    for i in range(count):
        candidate_id = candidate_ids[i]
        candidate_cursor = db.candidate.find({'id': candidate_id})
        if candidate_cursor.count() == 0:
            return Response(
                {
                    'error': 'Candidate not found.'
                },
                status.HTTP_404_NOT_FOUND
            )
        elif room_cursor.count() > 1:
            return Response(
                {
                    'error': 'Candidate id duplicated'
                },
                status.HTTP_400_BAD_REQUEST
            )
        ret_data = {
            k: v for k, v in
            dict(candidate_cursor[0]).items() if k in candidate_keys
        }
        candidates.append(ret_data)

    return Response(
        {
            'offset': offset,
            'limit': limit,
            'count': count,
            'candidates': candidates
        },
        status.HTTP_200_OK
    )
