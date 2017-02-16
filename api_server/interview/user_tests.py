from rest_framework import status
from rest_framework.test import APISimpleTestCase, APIRequestFactory
from django.conf import settings
import pymongo
import random
import string
import uuid
import datetime


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
                random.choice(string.ascii_lowercase) for i in range(10))
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserLoginTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def init_db(self):
        if self.db_client is None or self.db is None:
            self.db_client = pymongo.MongoClient(port=settings.DB_PORT)
            self.db = self.db_client[settings.DB_NAME]
        else:
            pass

    def get_get_response(self, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/user/login'
        response = self.client.get(url, data)
        return response

    def test_success_full(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_respond_template)
        self.db.users.insert_one(self.database_error_template)
        response = self.get_get_response(self.user_data_template)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['user']['username'],
            self.user_data_respond_template['username'])
        self.db.users.delete_many({})

    def test_user_not_exist(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_respond_template)
        self.db.users.insert_one(self.database_error_template)
        user_data = self.user_data_template.copy()
        user_data['username'] += '1s'
        response = self.get_get_response(user_data)
        self.assertEqual(response.data['error'], 'User does not exist.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.db.users.delete_many({})

    def test_key_error(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_respond_template)
        self.db.users.insert_one(self.database_error_template)
        user_data = self.user_data_template.copy()
        user_data['wuzhongshengyou'] = 'fuzeren'
        response = self.get_get_response(user_data)
        self.assertEqual(response.data['error'], 'Key error')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user_data = self.user_data_template.copy()
        del user_data['password']
        response = self.get_get_response(user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Key error')
        self.db.users.delete_many({})

    def test_dupl_name(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_respond_template)
        self.db.users.insert_one(self.database_error_template)
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
        response = self.get_get_response(self.user_data_template)
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
        self.db.users.delete_many({})

    def test_invalid_password(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_respond_template)
        self.db.users.insert_one(self.database_error_template)
        user_data = self.user_data_template.copy()
        user_data['password'] += 'life_experience'
        response = self.get_get_response(user_data)
        self.assertEqual(response.data['error'], 'Invalid password.')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.db.users.delete_many({})


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
                random.choice(string.ascii_lowercase) for i in range(10))
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserLogoutTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_get_response(self, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/user/logout'
        response = self.client.get(url, data)
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

    def test_no_token(self):
        self.init_token()
        post_data = self.post_data_template.copy()
        del post_data['token']
        response = self.get_get_response(post_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'Permission denied')

    def test_success(self):
        self.init_token()
        post_data = self.post_data_template.copy()
        response = self.get_get_response(post_data)
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
            test_db_name = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(10))
        # override settings
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(UserRegisterTestCase, cls).tearDownClass()
        # drop test database
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_post_response(self, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/user/register'
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
        self.assertEqual(response.data['error'], 'Key error')

    def test_name_conflict(self):
        self.user_data['username'] += 'x'
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.get_post_response(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Username already exists')


class UserManageTestCase(APISimpleTestCase):

    test_hr_data = {
        'username': 'elder',
        'password': 'gouqi',
        'type': 'hr',
        'email': 'plusonesec@pla301.cn',
        'organization': 'CCP',
        'contact': 'Beijing PLA 301 Hospital',
        'token': 'naive',
        'last_login': datetime.datetime.now()
    }

    test_candidate_data = {
        'username': 'HeWhoMustNotBeNamed',
        'password': 'HelloHawaii',
        'type': 'candidate',
        'email': 'basiclaw@CCP.cn',
        'organization': 'CCP',
        'contact': 'Hawaii',
        'token': 'simple',
        'last_login': datetime.datetime.now()
    }

    db_client = None

    factory = APIRequestFactory()

    @classmethod
    def setUpClass(cls):
        super(UserManageTestCase, cls).setUpClass()
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
        db = pymongo.MongoClient(port=settings.DB_PORT)[settings.DB_NAME]
        db.users.insert_one(UserManageTestCase.test_hr_data.copy())
        db.users.insert_one(UserManageTestCase.test_candidate_data.copy())

    @classmethod
    def tearDownClass(cls):
        super(UserManageTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_delete_response(self, username, query):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/user/' + username
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.delete(url)
        return response

    def get_get_response(self, username, query):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/user/' + username
        response = self.client.get(url, query)
        return response

    def get_put_response(self, username, query, data):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/user/' + username
        request = self.factory.get(url, query)
        url = request.get_raw_uri()
        response = self.client.put(url, data)
        return response

    def test_no_permission(self):
        response = self.get_get_response(
            self.test_candidate_data['username'], None)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'Permission denied')
        response = self.get_get_response(
            self.test_candidate_data['username'], {'token': 'none'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'Permission denied')
        response = self.get_get_response(
            self.test_candidate_data['username'],
            {'token': self.test_candidate_data['token']})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'Permission denied')

    def test_user_not_exists(self):
        response = self.get_get_response(
            'journalist', {'token': self.test_hr_data['token']})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'User does not exist.')

    def test_delete_success(self):
        response = self.get_delete_response(
            self.test_candidate_data['username'],
            {'token': self.test_hr_data['token']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        db = pymongo.MongoClient(port=settings.DB_PORT)[settings.DB_NAME]
        cursor = db.users.find(
            {'username': self.test_candidate_data['username']})
        self.assertEqual(cursor.count(), 0)
        db.users.insert_one(self.test_candidate_data.copy())

    def test_get_success(self):
        response = self.get_get_response(self.test_candidate_data['username'],
                                         {'token': self.test_hr_data['token']})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = self.test_candidate_data.copy()
        del expected['token']
        del expected['last_login']
        self.assertEqual(response.data, expected)

    def test_put_success(self):
        test_data = self.test_candidate_data.copy()
        test_data['organization'] = 'secret'
        del test_data['token']
        del test_data['last_login']
        response = self.get_put_response(self.test_candidate_data['username'],
                                         {'token': self.test_hr_data['token']},
                                         test_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected = self.test_candidate_data.copy()
        del expected['token']
        del expected['last_login']
        expected['organization'] = 'secret'
        self.assertEqual(response.data, expected)

    def test_put_failure(self):
        response = self.get_put_response(self.test_candidate_data['username'],
                                         {'token': self.test_hr_data['token']},
                                         {'token': 'hack'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Key error')
