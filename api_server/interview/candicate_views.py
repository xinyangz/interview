from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import datetime
import uuid


@api_view(['POST'])
def set_candidate(request, **kwargs):
    '''
    'id': '3001',
    'name': 'Mike',
    'email': 'example@example.com',
    'phone': '1300000000',
    'status': 'weimianshi',
    'roomId': '1001',
    'record':{
        'video': 'string',
        'board': 'string',
        'chat' : 'string',
        'code' : 'string',
        'report':'string'
    }
    '''

    required_keys = ['id', 'name', 'email', 'phone', 'status', 'roomId', 'record']
    record_keys = ['video', 'board', 'chat', 'code', 'report']
    candidate_data = request.data['candidate']
    token = request.data['token']

    # Check key error

    if set(required_keys) != set(candidate_data):
        return Response(
            {
                'status': '30',
                'error': 'Key error'
            },
            status.HTTP_400_BAD_REQUEST
        )
    if set(record_keys) != set(candidate_data['record']):
        return Response(
            {
                'status': '30',
                'error': 'Key error(in records)'
            },
            status.HTTP_400_BAD_REQUEST
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check user permission

    access_denied = False
    applicant = db.users.find({'token': token})
    if applicant.count() == 0:
        access_denied = True
    else:
        for item in applicant:
            if item['type'] not in ['hr', 'interviewer']:
                access_denied = True
            break
    if access_denied:
        return Response(
            {
                'status': '30',
                'error': 'Access denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    # Add record

    temp_username = "User_" + str(uuid.uuid4()[:8])
    while db.users.find({'username': temp_username}).count() > 0:
        temp_username = "User_" + str(uuid.uuid4()[:8])
    temp_password = uuid.uuid4()
    user_part = {
        'username': temp_username,
        'type': 'candidate',
        'email': candidate_data['email'],
        'password': temp_password,
        'organization': 'Candidate Group',
        'contact': candidate_data['phone'],
    }
    db.users.insert_one(user_part)

    candidate_part = candidate_data.copy()
    candidate_part['unique_username'] = temp_username
    db.candidate.insert_one(candidate_part)
    return Response(
        {
            'status': '200'
        },
        status.HTTP_200_OK
    )


@api_view(['GET'])
def set_candidate(request, **kwargs):
    '''
    'id': '3001',
    'name': 'Mike',
    'email': 'example@example.com',
    'phone': '1300000000',
    'status': 'weimianshi',
    'roomId': '1001',
    'record':{
        'video': 'string',
        'board': 'string',
        'chat' : 'string',
        'code' : 'string',
        'report':'string'
    }
    '''

    required_keys = ['token']
    optional_keys = ['offset', 'limit']
    candidate_data = request.data['candidate']
    token = request.data['token']

    # Check key error

    if set(required_keys) != set(candidate_data):
        return Response(
            {
                'status': '30',
                'error': 'Key error'
            },
            status.HTTP_400_BAD_REQUEST
        )
    if set(record_keys) != set(candidate_data['record']):
        return Response(
            {
                'status': '30',
                'error': 'Key error(in records)'
            },
            status.HTTP_400_BAD_REQUEST
        )


