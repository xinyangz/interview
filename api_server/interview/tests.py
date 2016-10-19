from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APISimpleTestCase
from django.conf import settings
import numpy as np
import numpy.random as nr
import pymongo
import string
# Create your tests here.

class UserLoginTestCase(APISimpleTestCase):

    user_data_template = {
        'username': 'elder',
        'password': 'gouqi',
        'key': 19260817
    }

    user_data_respond_template = {
        'username': 'elder',
        'password': 'gouqi',
        'type': 'hr',
        'email': 'plusonesec@pla301.cn',
        'organization': 'CCP',
        'contact': 'Beijing PLA 301 Hospital'
    }

    database_error_template = {
        'username': 'HeWhoMustNotBeNamed',
        'password': 'HelloHawaii',
        'type': 'hr',
        'email': 'basiclaw@CCP.cn',
        'organization': 'CCP',
        'contact': 'Hawaii'
    }

    @classmethod
    def setUpClass(cls):
        super(UserLoginTestCase, cls).setUpClass()
        client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = nr.bytes(10)
        settings.DB_NAME = test_db_name
        db = client[settings.DB_NAME]
        db.users.insert_one(user_data_respond_template)
        db.users.insert_one(database_error_template)


    @classmethod
    def tearDownClass(cls):
        super(UserLoginTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = reverse('user-login')
        response = self.client.post(url, data, format='json')
        return response

    def test_success_full(self):
        response = self.get_post_response(self.user_data_template)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user_respond_template)

    def test_user_not_exist(self):
        user_data = self.user_data_template.copy()
        user_data['username'] += '1s'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.data['error'], 'User does not exist.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_key_error(self):
        user_data = self.user_data_template.copy()
        user_data['wuzhongshengyou'] = 'fuzeren'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.data['error'], 'Key error')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dupl_name(self):
        client = pymongo.MongoClient(port=settings.DB_PORT)
        db = client[settings.DB_NAME]
        db.users.update(
            {'contact': 'Hawaii'},
            {
                '$set':
                {
                    'username': 'elder'
                }
            },
            {'upsert': 'false'}
        )
        response = self.get_post_response(self.user_data)
        db.users.update(
            {'contact': 'Hawaii'},
            {
                '$set':
                {
                    'username': 'HeWhoMustNotBeNamed'
                }
            },
            {'upsert': 'false'}
        )
        self.assertEqual(response.data['error'], 'Multiple records with the same user name.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_password(self):
        user_data = self.user_data_template.copy()
        user_data['password'] += 'life_experience'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.data['error'], 'Invalid password.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserLogoutTestCase(APISimpleTestCase):
    user_data_respond_template = {
        'username': 'elder',
        'password': 'gouqi',
        'type': 'hr',
        'email': 'plusonesec@pla301.cn',
        'organization': 'CCP',
        'contact': 'Beijing PLA 301 Hospital'
    }

    post_data_template = {
        'token': None,
    }

    @classmethod
    def setUpClass(cls):
        super(UserLoginTestCase, cls).setUpClass()
        client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = nr.bytes(10)
        settings.DB_NAME = test_db_name
        db = client[settings.DB_NAME]
        db.users.insert_one(user_data_respond_template)

    @classmethod
    def tearDownClass(cls):
        super(UserLoginTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = reverse('user-logout')
        response = self.client.post(url, data, format='json')
        return response

    def init_token(self):
        if post_data_template['token'] is None:
            client = pymongo.MongoClient(port=settings.DB_PORT)
            db = client[settings.DB_NAME]
            post_data_template['token'] = db.users.find_one({'username': 'elder'})['token']

    def test_key_error(self):
        self.init_token()
        post_data = post_data_template.copy()
        post_data['onepointgood'] = "runfast"
        response = self.get_post_response(self.user_data)
