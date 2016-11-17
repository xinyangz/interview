from rest_framework import status
from rest_framework.test import APISimpleTestCase, APIRequestFactory
from django.conf import settings
import pymongo
import random
import string
import uuid
import datetime
import os


class CandidateTestCase(APISimpleTestCase):
    # setup initial data

    candidate_data = {
        # 'id': '301',
        'name': 'elder',
        'email': 'changedChina@ccp.cn',
        'phone': '12345678901',
        'status': 'Alive',
        'roomId': 2301,
        # 'record': {
        #     'video': 'tanxiaofengsheng',
        #     'board': 'basiclaw',
        #     'chat': 'withWallace',
        #     'code': '100professors',
        #     'report': ''
        # }
    }

    another_candidate_data = {
        # 'id': '301',
        'name': 'Queen Elizabeth II',
        'email': 'someemail@somehost.uk',
        'phone': '10987654321',
        'status': 'Alive',
        'roomId': 2302,
        # 'record': {
        #     'video': '',
        #     'board': '',
        #     'chat': '',
        #     'code': '',
        #     'report': ''
        # }
    }

    applicant_data = {
        'username': 'MikeWallace',
        'type': 'hr',
        'email': 'news30@bbc.com',
        'password': 'dictator',
        'organization': '',
        'contact': '',
        'token': 'exampletoken',
        'last_login': datetime.datetime.now()
    }

    bad_applicant_data = {
        'username': 'Sharon',
        'type': 'HKhr',
        'email': 'bignews@make.hk',
        'password': 'yingdian',
        'organization': '',
        'contact': '',
        'token': 'fastertoken',
        'last_login': datetime.datetime.now()
    }

    room_data = {
        'id': 2301,
        'name': "A room",
        'logo': '',
        'interviewer': '',
        'candidates': [],
        'problems': []
    }

    # In user collection, user name is unique.
    # In applicant collection, id is unique and the reference to name
    #     in user collection('unique_username')
    db = None

    @classmethod
    def setUpClass(cls):
        super(CandidateTestCase, cls).setUpClass()
        # generate a test database name with no conflict
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        existing_db_names = set(db_client.database_names())
        test_db_name = 'test'
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = ''.join(
                random.choice(string.ascii_letters + string.digits)
                for _ in range(10))
        # override settings
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(CandidateTestCase, cls).tearDownClass()
        # drop test database
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def get_put_response_change(self, candidate_id, status, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/' + str(candidate_id) + '/status?status=' + \
            str(status) + '&token=' + token
        response = self.client.put(url)
        return response

    def get_delete_response_delete(self, candidate_id, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/' + str(candidate_id) + '?token=' + token
        response = self.client.delete(url)
        return response

    def get_put_response_put(self, candidate_id, data, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/' + str(candidate_id) + '?token=' + token
        response = self.client.put(url, data)
        return response

    def get_post_response_add(self, data, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate?token=' + token
        response = self.client.post(url, data, format='json')
        return response

    def get_get_response_get_all(self, offset, limit, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate?offset=' + str(offset) + '&limit' + str(limit) + \
            '&token=' + token
        response = self.client.get(url)
        return response

    def get_get_response_get(self, candidate_id, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/' + str(candidate_id) + '?token=' + token
        response = self.client.get(url)
        return response

    def get_post_response(self, data):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/' + data['id']
        response = self.client.post(url, data, format='json')
        return response

    def post_file_response(self, filepath, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + \
            '/candidate/file' + '?token=' + token
        with open(filepath, 'rb') as data:
            response = self.client.post(
                url, {'file': data}, format='multipart')
            return response

    def init_Wallace(self):
        if self.db is None:
            self.db = pymongo.MongoClient(
                port=settings.DB_PORT)[settings.DB_NAME]
        if self.db.users.find({'token': 'exampletoken'}).count() == 0:
            self.db.users.insert_one(self.applicant_data)

    def init_Sharon(self):
        if self.db is None:
            self.db = pymongo.MongoClient(
                port=settings.DB_PORT)[settings.DB_NAME]
        if self.db.users.find({'token': 'fastertoken'}).count() == 0:
            self.db.users.insert_one(self.bad_applicant_data)

    def init_Elder(self):
        if self.db is None:
            self.db = pymongo.MongoClient(
                port=settings.DB_PORT)[settings.DB_NAME]

        if self.db.candidate.find({'name': 'elder'}).count() == 0:
            temp_username = "User_" + str(uuid.uuid4())[:8]
            while self.db.users.find({'username': temp_username}).count() > 0:
                temp_username = "User_" + str(uuid.uuid4())[:8]
            temp_password = str(uuid.uuid4())
            user_info = {
                'username': temp_username,
                'type': 'candidate',
                'email': 'changedChina@ccp.cn',
                'password': temp_password,
                'organization': 'Candidate Group',
                'contact': '12345678901',
                'token': '',
                'last_login': 0
            }
            self.db.users.insert_one(user_info)
            candidate_data_tmp = self.candidate_data.copy()
            candidate_data_tmp['unique_username'] = temp_username
            candidate_data_tmp['id'] = 0
            self.db.candidate.insert_one(candidate_data_tmp)

    def get_life_status(self):
        print()
        print("Candidate:")
        for item in self.db.candidate.find({}):
            print(item)
        print()
        print("User:")
        for item in self.db.users.find({}):
            print(item)

    def test_add_success(self):
        self.init_Wallace()
        room_data_tmp = self.room_data.copy()
        room_data_tmp['candidates'] = [0]
        self.db.rooms.insert_one(room_data_tmp)
        elder_data = self.candidate_data.copy()
        self.db.users.delete_one({'type': 'candidate'})
        self.db.candidate.delete_one({'name': 'elder'})
        response = self.get_post_response_add(elder_data, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.db.users.delete_one({'type': 'candidate'})
        self.db.candidate.delete_one({'name': 'elder'})

    def test_add_bad_keys(self):
        self.init_Wallace()
        elder_data = self.candidate_data.copy()
        del elder_data['email']
        response = self.get_post_response_add(elder_data, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_bad_token(self):
        self.init_Sharon()
        elder_data = self.candidate_data.copy()
        response = self.get_post_response_add(elder_data, 'fastertoken')
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN)  # Angry

    def test_get_success(self):
        self.init_Wallace()
        self.init_Elder()
        response = self.get_get_response_get(0, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_bad_candidate(self):
        self.init_Wallace()
        self.init_Elder()
        response = self.get_get_response_get(305, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_dupl_candidate(self):  # Should never occur in practice
        self.init_Wallace()
        self.init_Elder()
        candidate_data_tmp = self.another_candidate_data.copy()
        candidate_data_tmp['id'] = 0
        self.db.candidate.insert_one(candidate_data_tmp)
        response = self.get_get_response_get(0, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.db.candidate.delete_one({'roomId': 2302})

    def test_get_bad_token(self):
        self.init_Sharon()
        self.init_Elder()
        response = self.get_get_response_get(301, 'fastertoken')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_success(self):
        self.init_Wallace()
        self.init_Elder()
        new_data = self.candidate_data.copy()
        new_data['id'] = 302
        response = self.get_put_response_put(0, new_data, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.get_put_response_put(302, new_data, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_dupl_candidate(self):
        self.init_Wallace()
        self.init_Elder()
        new_data = self.candidate_data.copy()
        new_data['id'] = 0
        another_data = self.another_candidate_data.copy()
        another_data['id'] = 302
        self.db.candidate.insert_one(another_data)
        response = self.get_put_response_put(302, new_data, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.db.candidate.delete_one({'roomId': 2302})

    def test_delete_success(self):
        self.init_Wallace()
        self.init_Elder()
        response = self.get_delete_response_delete(0, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_change_success(self):
        self.init_Wallace()
        self.init_Elder()
        response = self.get_put_response_change(
            0, 'AliveForever', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.get_put_response_change(0, 'Alive', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_change_bad_token(self):
        self.init_Wallace()
        self.init_Sharon()
        self.init_Elder()
        response = self.get_put_response_change(301, 'Yingdian', 'fastertoken')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_change_bad_candidate(self):
        self.init_Elder()
        self.init_Wallace()
        response = self.get_put_response_change(306, 'Alive', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_success(self):
        self.init_Elder()
        self.init_Wallace()
        another_data = self.another_candidate_data.copy()
        another_data['id'] = '302'
        self.db.candidate.insert_one(another_data)
        response = self.get_get_response_get_all(0, 2, 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.db.candidate.delete_one({'id': '302'})

    def test_file_parse_success(self):
        self.init_Elder()
        self.init_Wallace()
        # TODO: ROOMID
        response = self.post_file_response(
            'file_example/example2.csv', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.post_file_response(
            'file_example/example1.xlsx', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_file_format_error(self):
        self.init_Elder()
        self.init_Wallace()
        response = self.post_file_response(
            'file_example/example3.numbers', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.post_file_response(
            'file_example/example4.xlsx', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.post_file_response(
            'file_example/example5.csv', 'exampletoken')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
