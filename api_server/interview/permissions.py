import pymongo
from django.conf import settings
from datetime import datetime, timedelta

PASS = 0
NO_TOKEN = 1
INVALID_TOKEN = 2
NO_PERMISSION = 3
DUPLICATE_TOKEN = 4
EXPIRED_TOKEN = 5


def check(request, permitted_user_types=None, room_id=None):
    """
    Check the if the request is permitted.
    :param request: Request to check
    :param permitted_user_types:
        Types of users that are permitted.
        Default is None, which means do not check user types.
    :param room_id: Room to access
    :return: Predefined status
    """

    # Check & get token
    token = request.GET.get('token')
    if token is None:
        return NO_TOKEN

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Permission check
    cursor = db.users.find({'token': token})

    if cursor.count() == 0:
        return INVALID_TOKEN

    if cursor.count() > 1:
        return DUPLICATE_TOKEN

    if datetime.now() >= cursor[0]['last_login'] + timedelta(hours=6):
        return EXPIRED_TOKEN

    user_type = cursor[0]['type']

    # If need to check user type
    if permitted_user_types is not None:
        if user_type not in permitted_user_types:
            return NO_PERMISSION

    # If need to check room access permissions
    if room_id is not None and user_type != 'hr':
        user_name = cursor[0]['username']
        if user_type == 'interviewer':
            room_cursor = db.rooms.find(
                {'interviewer': user_name, 'id': room_id}
            )
            if room_cursor.count() == 0:
                return NO_PERMISSION
        elif user_type == 'candidate':
            room_cursor = db.rooms.find(
                {'candidates': user_name, 'id': room_id}
            )
            if room_cursor.count() == 0:
                return NO_PERMISSION
        else:
            return NO_PERMISSION

    return PASS
