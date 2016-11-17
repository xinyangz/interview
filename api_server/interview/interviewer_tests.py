from rest_framework import status
from rest_framework.test import APISimpleTestCase, APIRequestFactory
from rest_framework.test import APIRequestFactory
from django.conf import settings
import pymongo
import random
import string


class RoomTestCase(APISimpleTestCase):

    test_room_post = {
        "name": "HK",
        "interviewer": "zbh@xg.cn",
        "candidates": [
            100,
            101,
            102
        ]
    }

    test_room = {
        "id": 1,
        "name": "HK",
        "interviewer": "zbh",
        "candidates": [
            100,
            101,
            102
        ],
        "problems": []
    }

    test_interviewer = {
        'username': 'zbh',
        'password': 'qd',
        'type': 'interviewer',
        'email': 'zbh@xg.cn',
        'organization': 'Interviewer Group',
        'token': 'tk'
    }

    factory = APIRequestFactory()
    db = None

    @classmethod
    def setUpClass(cls):
        super(RoomTestCase, cls).setUpClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(db_client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = ''.join(
                random.choice(string.ascii_lowercase) for i in range(10))
        settings.DB_NAME = test_db_name
        # Initialize database
        RoomTestCase.db = db_client[test_db_name]

    @classmethod
    def tearDownClass(cls):
        super(RoomTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def test_get_roomId_success(self):
        self.db.rooms.insert_one(self.test_room)
        self.db.users.insert_one(self.test_interviewer)

        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/interviewer'
        response = self.client.get(url,
                                   {'token': self.test_interviewer['token']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['roomId'], self.test_room['id'])

        self.db.rooms.delete_many({})
        self.db.users.delete_many({})
