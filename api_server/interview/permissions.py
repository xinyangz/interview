import pymongo
from django.conf import settings


PASS = 0
NO_TOKEN = 1
INVALID_TOKEN = 2
NO_PERMISSION = 3
DUPLICATE_TOKEN = 4


def check_token(request, permitted_user_types=None):
    """
    Check the if the request is permitted.
    :param request: Request to check
    :param permitted_user_types: Types of users that are permitted. Default is None, which means do not check user types.
    :return: Values listed above
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

    # Do not check user type
    if permitted_user_types is None:
        return PASS

    for item in cursor:
        user_type = item['type']
        if user_type not in permitted_user_types:
            return NO_PERMISSION

    return PASS
