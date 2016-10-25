from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APISimpleTestCase
from django.conf import settings
# import numpy.random as nr
import pymongo
import random
import string
import uuid


class UserLoginTestCase(APISimpleTestCase):

    user_data_template = {
        'username': 'elder',
        'password': 'gouqi'
        # 'key': 19260817
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
    db_client = None

    @classmethod
    def setUpClass(cls):
        super(UserLoginTestCase, cls).setUpClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(db_client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            # test_db_name = nr.bytes(10)
            test_db_name = ''.join(
                random.choice(string.lowercase) for i in range(10))
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserLoginTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def init_db(self):
        if self.db_client is None:
            self.db_client = pymongo.MongoClient(port=settings.DB_PORT)

        self.db = self.db_client[settings.DB_NAME]
        if self.db.users.find({'username': 'elder'}).count() == 0:
            self.db.users.insert_one(self.user_data_respond_template)
        if self.db.users.find({'contact': 'Hawaii'}).count() == 0:
            self.db.users.insert_one(self.database_error_template)

    def get_post_response(self, data):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/user/login'
        response = self.client.post(url, data, format='json')
        return response

    def test_success_full(self):
        self.init_db()
        response = self.get_post_response(self.user_data_template)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['user']['username'],
            self.user_data_respond_template['username'])

    def test_user_not_exist(self):
        self.init_db()
        user_data = self.user_data_template.copy()
        user_data['username'] += '1s'
        response = self.get_post_response(user_data)
        self.assertEqual(response.data['error'], 'User does not exist.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_key_error(self):
        self.init_db()
        user_data = self.user_data_template.copy()
        user_data['wuzhongshengyou'] = 'fuzeren'
        response = self.get_post_response(user_data)
        self.assertEqual(response.data['error'], 'Key error')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user_data = self.user_data_template.copy()
        del user_data['password']
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Key error')

    def test_dupl_name(self):
        self.init_db()
        self.db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db = self.db_client[settings.DB_NAME]
        db.users.update(
            {'contact': 'Hawaii'},
            {
                '$set':
                {
                    'username': 'elder'
                }
            }
        )
        response = self.get_post_response(self.user_data_template)
        db.users.update(
            {'contact': 'Hawaii'},
            {
                '$set':
                {
                    'username': 'HeWhoMustNotBeNamed'
                }
            }
        )
        self.assertEqual(
            response.data['error'],
            'Multiple records with the same user name.')
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST)

    def test_invalid_password(self):
        self.init_db()
        user_data = self.user_data_template.copy()
        user_data['password'] += 'life_experience'
        response = self.get_post_response(user_data)
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
    db_client = None

    @classmethod
    def setUpClass(cls):
        super(UserLogoutTestCase, cls).setUpClass()
        client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = ''.join(
                random.choice(string.lowercase) for i in range(10))
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserLogoutTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/user/logout'
        response = self.client.post(url, data, format='json')
        return response

    def init_token(self):
        if self.db_client is None:
            self.db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db = self.db_client[settings.DB_NAME]
        if db.users.find({'username': 'elder'}).count() == 0:
            token = str(uuid.uuid4())
            user_data = self.user_data_respond_template.copy()
            user_data['token'] = token
            db.users.insert_one(user_data)
        if self.post_data_template['token'] is None:
            self.post_data_template['token'] = \
                db.users.find_one({'username': 'elder'})['token']

    def test_key_error(self):
        self.init_token()
        post_data = self.post_data_template.copy()
        post_data['onepointgood'] = "runfast"
        response = self.get_post_response(post_data)
        self.assertEqual(response.data['error'], 'Key error')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        post_data = self.post_data_template.copy()
        del post_data['token']
        response = self.get_post_response(post_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Key error')

    def test_not_login(self):
        self.init_token()
        post_data = self.post_data_template.copy()
        post_data['token'] = "thatsabigmistake"
        response = self.get_post_response(post_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'User has not logged in.')

    def test_success(self):
        self.init_token()
        post_data = self.post_data_template.copy()
        response = self.get_post_response(post_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/user/register'
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
        self.assertEqual(response.data['error'], 'Key error')

    def test_extra_info(self):
        self.user_data['username'] += 'x'
        user_data = self.user_data.copy()
        user_data['extra'] = 'hello'
        response = self.get_post_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Key error')

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
