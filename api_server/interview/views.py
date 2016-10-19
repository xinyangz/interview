from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo


@api_view(['GET'])
def test(request):
    """
    Test
    """
    if request.method == 'GET':
        return Response({'key': 'value'})


@api_view(['POST'])
def user_register(request):
    """
    {
        "username": "Tom",
        "type":
        "email": "example@example.com",
        "password": "12345",
        "organization": "Example Company"
        "contact": "Example Contact"
    }
    """
    required_keys = ['username', 'type', 'email', 'password']
    optional_keys = ['organization', 'contact']
    all_keys = required_keys + optional_keys
    data_dict = request.data

    # check
    for key in required_keys:
        if key not in data_dict:
            return Response({'status': '30', 'error': 'User information is incomplete'}, status.HTTP_400_BAD_REQUEST)
    for key in data_dict:
        if key not in all_keys:
            return Response({'status': '30', 'error': 'Unexpected field in user information'}, status.HTTP_400_BAD_REQUEST)

    # check type
    user_type = data_dict['type']
    if user_type not in ('hr', 'interviewer', 'candidate'):
        return Response({'status': '30', 'error': 'Invalid user type'}, status.HTTP_400_BAD_REQUEST)

    client = pymongo.MongoClient(port=settings.DB_PORT)
    db = client[settings.DB_NAME]

    # check if username is used
    username = data_dict['username']
    cursor = db.users.find({'username': username})
    if cursor.count() > 0:
        return Response({'status': '30', 'error': 'Username already exists'}, status.HTTP_401_UNAUTHORIZED)

    # insert
    original_dict = data_dict.copy()
    db.users.insert_one(data_dict)
    return Response(original_dict, status=status.HTTP_200_OK)
