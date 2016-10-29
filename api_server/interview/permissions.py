import pymongo
from django.conf import settings


def check_permission(request, permitted_user_types):
    # Check & get token
    token = request.GET.get('token')
    if token is None:
        return False

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Permission check
    cursor = db.users.find({'token': token})

    if cursor.count() == 0:
        return False

    # TODO: cursor.count() > 1

    for item in cursor:
        user_type = item['type']
        if user_type not in permitted_user_types:
            return False

    return True
