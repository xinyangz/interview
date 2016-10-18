from django.urls import reverse
from rest_framework import status
from rest_framework.test import APISimpleTestCase
from django.conf import settings
import pymongo
import random
import string


class UserRegisterTestCase(APISimpleTestCase):
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
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = reverse('user-register')
        response = self.client.post(url, data, format='json')
        return response

    def test_success_full(self):
        user_data = {
            "username": "Tom",
            "type": "hr",
            "email": "example@example.com",
            "password": "12345",
            "organization": "Example Company",
            "contact": "Example Contact"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, user_data)

    def test_success_no_optional(self):
        user_data = {
            "username": "Tom2",
            "type": "hr",
            "email": "example@example.com",
            "password": "12345"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, user_data)

    def test_lack_info(self):
        user_data = {
            "username": "Tom3",
            "email": "example@example.com",
            "password": "12345"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_extra_info(self):
        user_data = {
            "username": "Tom4",
            "type": "hr",
            "email": "example@example.com",
            "password": "12345",
            "test": "hello"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_type(self):
        user_data = {
            "username": "Tom5",
            "type": "what",
            "email": "example@example.com",
            "password": "12345"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_conflict(self):
        user_data = {
            "username": "Tom6",
            "type": "hr",
            "email": "example@example.com",
            "password": "12345"
        }
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
