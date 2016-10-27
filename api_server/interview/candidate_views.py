from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import datetime
import uuid


@api_view(['POST', 'GET'])
def get_set_candidate(request, **kwargs):
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
    token = request.GET.get('token')
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


    if request.method == 'POST':
        required_keys = ['id', 'name', 'email', 'phone', 'status', 'roomId', 'record']
        record_keys = ['video', 'board', 'chat', 'code', 'report']
        candidate_data = request.data

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
            print "Key error record"
            return Response(
                {
                    'status': '30',
                    'error': 'Key error(in records)'
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
    elif request.method == 'GET':
        print "GET"
        offset = request.GET.get('offset')
        limit = request.GET.get('limit')

        # TODO: Get info
        sorted_candidate = db.candidate.find({}).sort({"id": +1})
        if offset + limit - 1 > len(sorted_candidate):
            return Response(
                {
                    'status' :'30',
                    'error': 'Index out of boundary'
                },
                status.HTTP_400_BAD_REQUEST
            )

        print sorted_candidate[offset, offset + limit]
        return Response(
            {
                #sorted_candidate[offset, offset + limit]
            },
            status.HTTP_200_OK
        )
    else:
        return Response(
            {
                'status': '30',
                'error': 'Unknown method'
            },
            status.HTTP_400_BAD_REQUEST
        )



@api_view(['GET', 'DELETE', 'PUT'])
def workon_candidate(request, candidate_id, **kwargs):
    token = request.GET.get('token')
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
            },
            status.HTTP_404_NOT_FOUND
        )
    elif data.count() > 1: # Should never occur
        return Response(
            {
                'status': '30',
                'error': 'Candidate id duplicated'
            },
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
            return Response(
                {
                    'data':  temp_data
                },
                status.HTTP_200_OK
            )
    elif request.method == 'PUT':
        # Put data
        input_data = request.data
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
        return Response(
            input_data,
            status.HTTP_200_OK
        )

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

@api_view(['PUT'])
def change_status_candidate(request, candidate_id, **kwargs):

    new_status = request.GET.get('status')
    token = request.GET.get('token')
    # Check key error


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

    candidate = db.candidate.find({'id': candidate_id})
    if candidate.count() == 0:
        return Response(
            {
                'status': '30',
                'error': 'Candidate not found.'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif candidate.count() > 1:
        return Response(
            {
                'status': '30',
                'error': 'Candidate id duplicated'
            },
            status.HTTP_400_BAD_REQUEST
        )
    else:
        for item in candidate:
            db.candidate.update(
                {'id': candidate_id},
                {
                    '$set':
                    {
                        'status': new_status
                    }
                }
            )
            response_dict = {
                "id": item['id'],
                "name": item['name'],
                "email": item['email'],
                "phone": item['phone'],
                'status': item['status'],
                'roomId': item['roomId'],
                'record': item['record'],
            }
            return Response(
                response_dict,
                status.HTTP_200_OK
            )

