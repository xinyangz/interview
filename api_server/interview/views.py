from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def test(request, **kwargs):
    """
    Test
    """
    if request.method == 'GET':
        return Response({'version': kwargs['version']})
