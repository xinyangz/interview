from __future__ import unicode_literals
from rest_framework import status
from rest_framework.test import APISimpleTestCase, APIRequestFactory
from django.conf import settings
import pymongo
import random
import string
import datetime
import subprocess


class ReportTestCase(APISimpleTestCase):

    user_data_template = {
        'username': 'elder',
        'password': 'gouqi',
        'type': 'candidate',
        'email': 'plusonesec@pla301.cn',
        'organization': 'CCP',
        'contact': 'Beijing PLA 301 Hospital'
    }

    candidate_data_template = {
        'id': 301,
        'name': 'elder',
        'phone': '12345678901',
        'email': 'plusonesec@pla301.cn',
        'status': 'Alive',
        'roomId': 301,
        'record':
        {
            'video': 'http://www.youtube.com/xxx',
            'board': 'Local path',
            'chat': 'withWallace',
            'code': 'plusonesecond',
            'report': ''
        },
        'unique_username': 'elder'
    }

    interviewer_data_template = {
        'username': 'Sharon',
        'password': 'Naive',
        'type': 'hr',
        'email': '',
        'organization': '',
        'contact': '',
        'token': 'houbuhouwa',
        'last_login': datetime.datetime.now()
    }

    room_template = {
        'id': 301,
        'logo': '',
        'candidates': [
            '301'
        ],
        'problems': [1, 2, 3, 4],
        'interviewer': 'Sharon'
    }

    problem_choice_template = {
      "id": 1,
      "roomId": 301,
      "type": "choice",
      "content": {
          "title": "A multiple choice example",
          "description": "here is description",
          "option": [{
                    "content": "Choice 1",
                    "correct": "True"
                },
                {
                    "content": "Choice 2",
                    "correct": "False"
                }
              ],
          "sampleInput": "1 2",
          "sampleOutput": "-1"
        }
    }

    problem_blank_template = {
      "id": 2,
      "roomId": 301,
      "type": "blank",
      "content": {
          "title": "A blank filling example",
          "description": "here is description",
        }
    }

    problem_coding_template = {
      "id": 3,
      "roomId": 301,
      "type": "code",
      "content": {
          "title": "Implement A+B problem with SA on quantum computers",
          "description": "here is description",
          "sampleInput": "1 2",
          "sampleOutput": "3"
        }
    }

    problem_answer_template = {
      "id": 4,
      "roomId": 301,
      "type": "answer",
      "content": {
          "title": "Who's the 3rd in the 1926 Life Champion?",
          "description": "here is description",
        }
    }

    db_client = None

    @classmethod
    def setUpClass(cls):
        super(ReportTestCase, cls).setUpClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        test_db_name = 'test'
        existing_db_names = set(db_client.database_names())
        while True:
            if test_db_name not in existing_db_names:
                break
            test_db_name = ''.join(
                random.choice(string.ascii_letters + string.digits)
                for _ in range(10))
        settings.DB_NAME = test_db_name

    @classmethod
    def tearDownClass(cls):
        super(ReportTestCase, cls).tearDownClass()
        db_client = pymongo.MongoClient(port=settings.DB_PORT)
        db_client.drop_database(settings.DB_NAME)

    def init_db(self):
        if self.db_client is None:
            self.db_client = pymongo.MongoClient(port=settings.DB_PORT)
        self.db = self.db_client[settings.DB_NAME]

    def get_put_response(self, candidate_id, data, token):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.put(url, data, format='json')
        return response

    def get_get_response(self, candidate_id, token):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.get(url)
        return response

    def get_del_response(self, candidate_id, token):
        url = '/api/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.delete(url)
        return response

    def init_info(self):
        self.db.users.insert_one(self.user_data_template)
        self.db.users.insert_one(self.interviewer_data_template)
        self.db.candidate.insert_one(self.candidate_data_template)
        self.db.room.insert_one(self.room_template)
        self.db.problems.insert_one(self.problem_choice_template)
        self.db.problems.insert_one(self.problem_blank_template)
        self.db.problems.insert_one(self.problem_coding_template)
        self.db.problems.insert_one(self.problem_answer_template)

    def clear_database(self):
        self.db.users.delete_many({})
        self.db.candidate.delete_many({})
        self.db.room.delete_many({})
        self.db.problems.delete_many({})

    def test_report_success(self):
        self.init_db()
        self.init_info()
        response = self.get_put_response(
            301, "His English is very poor", 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_get_response(301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_del_response(301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # subprocess.call("sh clear_tex.sh", shell=True)
        self.clear_database()

    def test_get_failure(self):
        self.init_db()
        self.init_info()
        # Permission denied
        response = self.get_get_response(301, 'yingdiandeyisi')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Candidate not found
        response = self.get_get_response(1301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.clear_database()

    def test_delete_failure(self):
        self.init_db()
        self.init_info()
        # Permission denied
        response = self.get_del_response(301, 'yingdiandeyisi')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Candidate not found
        response = self.get_del_response(1301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.clear_database()

