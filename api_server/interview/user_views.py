from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import datetime
import uuid
import jsonschema
from .schemas import swagger_schema
from . import permissions


@api_view(['GET'])
def user_login(request, **kwargs):
    '''
    'username': 'elder',
    'password': 'gouqi',
    'key': 19260817
    '''

    # required_keys = ['username', 'password', 'key']

    required_keys = ['username', 'password']
    user_data = request.GET

    for key in required_keys:
        if key not in user_data:
            return Response(
                {
                    'status': '400',
                    'error': 'Key error'
                },
                status.HTTP_400_BAD_REQUEST
            )
    for key in user_data:
        if key not in required_keys:
            return Response(
                {
                    'status': '400',
                    'error': 'Key error'
                },
                status.HTTP_400_BAD_REQUEST
            )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    cursor = db.users.find({'username': user_data['username']})
    if cursor.count() == 0:
        return Response(
            {
                'status': '400',
                'error': 'User does not exist.'
            },
            status.HTTP_400_BAD_REQUEST
        )
    elif cursor.count() > 1:
        return Response(
            {
                'status': '400',
                'error': 'Multiple records with the same user name.'
            },
            status.HTTP_400_BAD_REQUEST
        )
    else:
        for item in cursor:
            # Generate unique token for user
            if item['password'] == user_data['password']:
                user_part = {
                    'username': item['username'],
                    'type': item['type'],
                    'email': item['email'],
                    'password': item['password'],
                    'organization': item['organization'],
                    'contact': item['contact']
                }
                token = uuid.uuid4()
                while db.users.find({'token': str(token)}).count() > 0:
                    token = uuid.uuid4()
                db.users.update(
                    {'username': item['username']},
                    {
                        '$set':
                        {
                            'token': str(token),
                            'last_login': datetime.datetime.now()
                        }
                    }
                )
                return Response(
                    {
                        'user': user_part,
                        'token': str(token)
                    }
                )
            else:
                return Response(
                    {
                        'status': '400',
                        'error': 'Invalid password.'
                    },
                    status.HTTP_400_BAD_REQUEST
                )


@api_view(['GET'])
def user_logout(request, **kwargs):
    perm_result = permissions.check_token(request)
    if perm_result == permissions.NO_TOKEN or perm_result == permissions.NO_PERMISSION:
        return Response(
            {
                'status': '403',
                'error': 'Permission denied'
            },
            status.HTTP_403_FORBIDDEN
        )
    elif perm_result == permissions.INVALID_TOKEN:
        return Response(
            {
                'status': '403',
                'error': 'User has not logged in.'
            },
            status.HTTP_403_FORBIDDEN
        )

    user_data = request.GET

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    cursor = db.users.find({'token': user_data['token']})

    if cursor.count() == 0:
        return Response(
            {
                'status': '403',
                'error': 'User has not logged in.'
            },
            status.HTTP_403_FORBIDDEN
        )
    else:
        for item in cursor:
            db.users.update(
                {'token': item['token']},
                {
                    '$set':
                    {
                        'token': '',
                        'last_login': datetime.datetime(1970, 1, 1, 0, 0, 0)
                    }
                }
            )
            return Response(
                {
                    'status': '200'
                },
                status.HTTP_200_OK
            )


@api_view(['POST'])
def user_register(request, **kwargs):
    """
    {
        "username": "Tom",
        "type": "hr",
        "email": "example@example.com",
        "password": "12345",
        "organization": "Example Company",
        "contact": "Example Contact"
    }
    """

    data_dict = request.data

    try:
        jsonschema.validate(data_dict, swagger_schema['definitions']['User'])
    except:
        return Response({'status': '400', 'error': 'Key error'}, status.HTTP_400_BAD_REQUEST)

    client = pymongo.MongoClient(port=settings.DB_PORT)
    db = client[settings.DB_NAME]

    # check if username is used
    username = data_dict['username']
    cursor = db.users.find({'username': username})
    if cursor.count() > 0:
        return Response({'status': '401', 'error': 'Username already exists'}, status.HTTP_401_UNAUTHORIZED)

    # insert
    original_dict = data_dict.copy()
    db.users.insert_one(data_dict)
    return Response(original_dict, status=status.HTTP_200_OK)


@api_view(['DELETE', 'GET', 'PUT'])
def user_manage(request, **kwargs):

    permitted_user_types = ['hr', 'interviewer']

    if permissions.check_token(request, permitted_user_types) != permissions.PASS:
        return Response(
            {
                'status': '403',
                'error': 'Permission denied'
            },
            status.HTTP_403_FORBIDDEN
        )

    username = kwargs['username']

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    cursor = db.users.find({'username': username})
    if cursor.count() == 0:
        return Response(
            {
                'status': '404',
                'error': 'User does not exist.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif cursor.count() > 1:
        return Response(
            {
                'status': '400',
                'error': 'Multiple records with the same user name.'
            },
            status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'DELETE':
        db.users.delete_one({'username': username})
        return Response(status=status.HTTP_200_OK)

    if request.method == 'GET':
        user_data = cursor[0]
        del user_data['_id']
        del user_data['token']
        return Response(user_data, status.HTTP_200_OK)

    if request.method == 'PUT':
        changed_data = request.data

        try:
            jsonschema.validate(changed_data, swagger_schema['definitions']['User'])
        except:
            return Response({'status': '400', 'error': 'Key error'}, status.HTTP_400_BAD_REQUEST)

        db.users.update_one(
            {'username': username},
            {
                '$set': changed_data
            }
        )

        user_data = db.users.find({'username': username})[0]
        del user_data['_id']
        del user_data['token']
        return Response(user_data, status.HTTP_200_OK)
