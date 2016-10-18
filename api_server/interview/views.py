from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
        "email": "example@example.com",
        "key": "12345",
        "organization": "Example Company",
        "contact": "Example Contact"
    }
    """
    required_keys = ['username', 'email', 'key', 'type']
    optional_keys = ['organization', 'contact']
    all_keys = required_keys + optional_keys
    dict = request.data

    # check
    for key in required_keys:
        if not key in dict:
            return Response({'status': '30', 'error': '缺少信息'}, status.HTTP_400_BAD_REQUEST)
    for key in dict:
        if not key in all_keys:
            return Response({'status': '30', 'error': '存在多余信息'}, status.HTTP_400_BAD_REQUEST)

    # check type
    user_type = dict['type']
    if user_type not in ('hr', 'interviewer', 'candidate'):
        return Response({'status': '30', 'error': '用户类型错误'}, status.HTTP_400_BAD_REQUEST)

    client = pymongo.MongoClient()
    db = client['interview']

    # check if username is used
    username = dict['username']
    cursor = db.users.find({'username': username})
    if cursor.count() > 0:
        return Response({'status': '30', 'error': '存在同名用户'}, status.HTTP_401_UNAUTHORIZED)

    # insert
    original_dict = dict.copy()
    db.users.insert_one(dict)
    print(dict)
    return Response(original_dict, status=status.HTTP_200_OK)
