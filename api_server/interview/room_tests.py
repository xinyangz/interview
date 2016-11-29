from rest_framework import status
from rest_framework.test import APISimpleTestCase, APIRequestFactory
from rest_framework.test import APIRequestFactory
from django.conf import settings
import pymongo
import random
import string
from PIL import Image
import tempfile
import os
import datetime


class RoomTestCase(APISimpleTestCase):

    test_room_post = {
        "name": "HK",
        "interviewer": "zbh",
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

    test_hr = {
        'id': 0,
        'username': 'Ha',
        'password': 'gua',
        'type': 'hr',
        'email': 'basiclaw@CCP.cn',
        'organization': 'CCP',
        'contact': 'Hawaii',
        'token': 'simple',
        'last_login': datetime.datetime.now()
    }

    test_interviewer = {
        'username': 'zbh',
        'password': 'qd',
        'type': 'interviewer',
        'email': 'zbh@hk.cn',
        'organization': 'Interviewer Group',
        'token': 'tk',
        'last_login': datetime.datetime.now()
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
        RoomTestCase.db.users.insert_one(RoomTestCase.test_hr.copy())

    @classmethod
    def tearDownClass(cls):
        super(RoomTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_delete_response(self, room_id, query):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room/' + \
            str(room_id)
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.delete(url)
        return response

    def get_get_response(self, room_id, query):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room/' + \
            str(room_id)
        response = self.client.get(url, query)
        return response

    def get_put_response(self, room_id, query, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room/' + \
            str(room_id)
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.put(url, data)
        return response

    def get_put_logo_response(self, room_id, query, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room/' + \
            str(room_id) + '/logo'
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.put(url, data, format='multipart')
        return response

    def get_post_response_root(self, query, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room'
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.post(url, data)
        return response

    def get_get_response_root(self, query):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/room'
        response = self.client.get(url, query)
        return response

    def test_create_room(self):
        response = self.get_post_response_root(
            {'token': self.test_hr['token']},
            self.test_room_post)
        # Get tmp username
        cursor = self.db.users.find({'type': 'interviewer'})
        self.assertEqual(cursor.count(), 1)
        res_room = self.test_room.copy()
        res_room['interviewer'] = cursor[0]['username']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, res_room)
        self.db.rooms.delete_one({'id': 1})
        self.db.users.delete_one({'type': 'interviewer'})

    def test_get_list(self):
        for i in range(20):
            tmp_room = self.test_room_post.copy()
            tmp_room['id'] = i + 1
            self.db.rooms.insert_one(tmp_room)
        response = self.get_get_response_root({'token': self.test_hr['token'],
                                               'offset': 5,
                                               'limit': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 10)
        rooms = response.data['rooms']
        for i in range(10):
            self.assertEqual(rooms[i]['id'], i + 6)
        response = self.get_get_response_root({'token': self.test_hr['token'],
                                               'offset': 15,
                                               'limit': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 5)
        self.db.rooms.delete_many({})

    def test_not_found(self):
        response = self.get_delete_response(
            1, {'token': self.test_hr['token']})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_success(self):
        tmp_room = self.test_room.copy()
        tmp_room['id'] = 0
        self.db.rooms.insert_one(tmp_room)
        response = self.get_delete_response(
            0, {'token': self.test_hr['token']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_success(self):
        tmp_room = self.test_room.copy()
        self.db.rooms.insert_one(tmp_room)
        response = self.get_get_response(
            1, {'token': self.test_hr['token']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.test_room)
        self.db.rooms.delete_many({})

    def test_put_success_same_interviewer(self):
        self.db.users.insert_one(self.test_interviewer)
        tmp_room = self.test_room.copy()
        self.db.rooms.insert_one(tmp_room)
        update_data = self.test_room_post.copy()
        update_data['name'] = 'USA'
        updated_room = self.test_room.copy()
        updated_room['name'] = 'USA'
        response = self.get_put_response(
            1, {'token': self.test_hr['token']}, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, updated_room)
        self.db.rooms.delete_many({})
        self.db.users.delete_many({'type': 'interviewer'})

    def test_put_success_different_interviewer(self):
        self.db.users.insert_one(self.test_interviewer)
        tmp_room = self.test_room.copy()
        self.db.rooms.insert_one(tmp_room)
        update_data = self.test_room_post.copy()
        update_data['name'] = 'USA'
        update_data['interviewer'] = 'a@b.c'
        response = self.get_put_response(
            1, {'token': self.test_hr['token']}, update_data)
        updated_room = self.test_room.copy()
        updated_room['name'] = 'USA'
        updated_room['interviewer'] = \
            self.db.users.find({'email': 'a@b.c'})[0]['username']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, updated_room)
        self.db.rooms.delete_many({})
        self.db.users.delete_many({'type': 'interviewer'})

    def test_logo_success(self):
        tmp_room = self.test_room.copy()
        self.db.rooms.insert_one(tmp_room)

        # Generate logo
        image = Image.new('RGB', (100, 100), "#ddd")
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file, 'jpeg')

        response = self.get_put_logo_response(
            1, {'token': self.test_hr['token']}, {'image': tempfile})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # print(response.data['logo'])

        # Delete file
        file_path = os.path.join(settings.FILE_ROOT, str(1), 'logo.jpg')
        os.remove(file_path)

        self.db.rooms.delete_many({})
