from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import datetime
import uuid
import jsonschema
from . import permissions
from . import sequences
from .schemas import swagger_schema


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
        candidate_data = request.data

        # Check key error
        try:
            jsonschema.validate(candidate_data, swagger_schema['definitions']['PostCandidate'])
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
        temp_password = uuid.uuid4()
        user_part = {
            'username': temp_username,
            'type': 'candidate',
            'email': candidate_data['email'],
            'password': temp_password,
            'organization': 'Candidate Group',
        }
        if 'phone' in candidate_data:
            user_part['contact'] = candidate_data['phone']
        db.users.insert_one(user_part)

        # Generate unique id
        candidate_id = sequences.get_next_sequence('candidate_id')

        candidate_part = candidate_data.copy()
        candidate_part['unique_username'] = temp_username
        candidate_part['id'] = candidate_id
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

        sorted_candidate = db.candidate.find(
            {
                'id': {'$gte': offset + 1, '$lte': offset + limit}
            }
        ).sort('id', pymongo.ASCENDING)
        count = sorted_candidate.count()
        return_list = map(lambda x: {k: v for k, v in dict(x).items() if k in candidate_keys},
                          list(sorted_candidate))
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
            temp_data = {k: v for k, v in dict(item).items() if k in candidate_keys}
            return Response(
                temp_data,
                status.HTTP_200_OK
            )
    elif request.method == 'PUT':
        # Put data
        input_data = request.data

        try:
            jsonschema.validate(input_data, swagger_schema['definitions']['Candidate'])
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
                            'error': 'Trying to generate candidates with same id'
                         },
                        status.HTTP_400_BAD_REQUEST
                    )
        temp_data = {k: v for k, v in input_data.items() if k in candidate_keys}
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
            response_dict = {k: v for k, v in dict(item).items() if k in candidate_keys}

            return Response(
                response_dict,
                status.HTTP_200_OK
            )
