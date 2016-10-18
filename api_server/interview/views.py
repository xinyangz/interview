from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import pymongo

'''
@api_view(['GET'])
def test(request):
    """
    Test
    """
    if request.method == 'GET':
        return Response({'key': 'value'})
'''
@api_view(['GET'])
def user_login(request):
    '''
    'username': 'elder',
    'password': 'gouqi',
    'key': 19260817
    '''

    required_keys = ['username', 'password', 'key']
    user_data = request.data

    for key in required_keys:
        if key not in user_data:
            return Response({'status': '30', 'error': 'Key error'}, status.HTTP_400_BAD_REQUEST)

    client = pymongo.MongoClient()
    db = client['interview']

    cursor = db.users.find({'username': user_data['username']})
    if cursor.count() == 0:
        return Response({'status': '30', 'error': 'User does not exist.'}, status.HTTP_400_BAD_REQUEST)
    elif cursor.count() > 1:
        return Response({'status': '30', 'error': 'Database error. Multiple records with the same username.'}, status.HTTP_400_BAD_REQUEST)
    else:
        for item in cursor:
            if item['password'] == user_data['password']:
                user_part = {
                    'username': item['username'],
                    'type': item['type'],
                    'email': item['email'],
                    'password': item['password'],
                    'organization': item['organization'],
                    'contact': item['contact']
                }
                #token =
            else:
                return Response({'status': '30', 'error': 'Invalid username or password,'}, status.HTTP_400_BAD_REQUEST)

