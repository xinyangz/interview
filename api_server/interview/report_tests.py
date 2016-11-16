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
        'problems': [1],
        'interviewer': 'Sharon'
    }

    problem_template = {
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
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.put(url, data, format='json')
        return response

    def get_get_response(self, candidate_id, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.get(url)
        return response

    def get_del_response(self, candidate_id, token):
        url = '/' + settings.REST_FRAMEWORK['DEFAULT_VERSION'] + '/report/' + \
            str(candidate_id) + '?token=' + token
        response = self.client.delete(url)
        return response

    def test_report_success(self):
        self.init_db()
        self.db.users.insert_one(self.user_data_template)
        self.db.users.insert_one(self.interviewer_data_template)
        self.db.candidate.insert_one(self.candidate_data_template)
        self.db.room.insert_one(self.room_template)
        self.db.problems.insert_one(self.problem_template)
        response = self.get_put_response(
            301, "His English is very poor", 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_get_response(301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_del_response(301, 'houbuhouwa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        subprocess.call("sh clear_tex.sh", shell=True)
