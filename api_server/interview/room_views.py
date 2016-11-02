from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import jsonschema
from .schemas import swagger_schema
from . import permissions


@api_view(['GET', 'POST'])
def root(request, **kwargs):

    permitted_user_types = ['hr']

    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    if request.method == 'POST':
        room_data = request.data

        try:
            jsonschema.validate(room_data, swagger_schema['definitions']['RoomPost'])
        except:
            return Response(
                {'error': 'Key error'},
                status.HTTP_400_BAD_REQUEST
            )

        client = pymongo.MongoClient()
        db = client[settings.DB_NAME]


