from django.urls import reverse
from rest_framework import status
from rest_framework.test import APISimpleTestCase
from django.conf import settings
import pymongo
import random
import string


class UserRegisterTestCase(APISimpleTestCase):
    # setup initial data
    user_data = {
        'username': 'x',
        'type': 'hr',
        'email': 'example@example.com',
        'password': '12345',
        'organization': 'Example Company',
        'contact': 'Example Contact'
    }

    @classmethod
    def setUpClass(cls):
        super(UserRegisterTestCase, cls).setUpClass()
        # generate a test database name with no conflict
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        existing_db_names = set(db_client.database_names())
        test_db_name = 'test'
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(10))
        # override settings
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserRegisterTestCase, cls).tearDownClass()
        # drop test database
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = reverse('user-register')
        response = self.client.post(url, data, format='json')
        return response

    def test_success_full(self):
        self.user_data['username'] += 'x'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.user_data)

    def test_success_no_optional(self):
        self.user_data['username'] += 'x'
        user_data = self.user_data.copy()
        del user_data['organization']
        del user_data['contact']
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, user_data)

    def test_lack_info(self):
        self.user_data['username'] += 'x'
        user_data = self.user_data.copy()
        del user_data['email']
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'User information is incomplete')

    def test_extra_info(self):
        self.user_data['username'] += 'x'
        user_data = self.user_data.copy()
        user_data['extra'] = 'hello'
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Unexpected field in user information')

    def test_wrong_type(self):
        self.user_data['username'] += 'x'
        user_data = self.user_data.copy()
        user_data['type'] = 'what'
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid user type')

    def test_name_conflict(self):
        self.user_data['username'] += 'x'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Username already exists')
