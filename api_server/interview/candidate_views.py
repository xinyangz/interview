from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import datetime
import uuid


@api_view(['POST'])
def set_candidate(request,  **kwargs):
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
    token = request.POST['token']

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
def get_candidate_list(request,  **kwargs):

    all_keys = ['offset', 'limit']
    candidate_data = request.data
    token = request.GET['token']

    # Check key error

    for key in candidate_data:
        if key not in all_keys:
            return Response(
                {
                    'status': '30',
                    'error': 'Key error(in records)'
                },
                status.HTTP_400_BAD_REQUEST
            )

    # Check user permission

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

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

    # TODO: Get info

@api_view(['GET', 'DELETE', 'PUT'])
def workon_candidate(request, candidate_id, **kwargs)

    token = request.GET['token']
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

    # Check existance
    data = db.candidate.find({'id': candidate_id})
    if data.count() == 0:
        return Response(
            {
                'status': '30',
                'error': 'Candidate not found.'
            }
            status.HTTP_404_NOT_FOUND
        )
    elif data.count() > 1:
        return Response(
            {
                'status': '30',
                'error': 'Candidate id duplicated'
            }
            status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'GET':
        # Get data
        for item in data:
            temp_data = {}
            temp_data['id'] = item['id']
            temp_data['name'] = item['name']
            temp_data['email'] = item['email']
            temp_data['phone'] = item['phone']
            temp_data['status'] = item['status']
            temp_data['roomId'] = item['roomId']
            temp_data['record'] = item['record']
            return temp_data
    elif request.method == 'PUT':
        # Put data
        input_data = request.data['candidate']
        if input_data['id'] is not candidate_id:
            for item in data:
                dulp_list = db.candidate.find({'id': input_data['id']})
                if dulp_list.count() > 0:
                    return Response(
                        {
                            'status': '30',
                            'error': 'Trying to generate candidates with same id'
                         },
                        status.HTTP_400_BAD_REQUEST
                    )
        db.candidate.update(
            {'id': candidate_id},
            {
                '$set':
                {
                    'id': input_data['id'],
                     'name': input_data['name'],
                    'email': input_data['email'],
                    'phone': input_data['phone'],
                    'status': input_data['status'],
                    'roomId': input_data['roomId'],
                    'record': input_data['record']
                }
            }
        )
        return db.candidate.find_one({'id': input_data['id']})

    elif request.method == 'DELETE':
        # Delete data
        db.candidate.delete_one({'id': candidate_id})
        return Response(
            status.HTTP_200_OK
        )

    else:
        return Response(
            {
                'status': '30',
                'error': 'Unknown request method'
            },
            status.HTTP_400_BAD_REQUEST
        )


