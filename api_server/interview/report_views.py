from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import uuid
import subprocess
import pylatex
import os

@api_view(['PUT'])
def put_report(request, candidate_name, **kwargs):

    '''
    'id': '7001',
    'roomId': '101',
    'text': 'string'
    '''

    required_keys = ['candidate_id', 'text', 'token']

    report_data = request.data
    token = report_data['token']

    # Check key error

    if set(required_keys) != set(report_data):
        return Response(
            {
                'status': '30',
                'error': 'Key error'
            },
            status.HTTP_400_BAD_REQUEST
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    # Check user permission

    access_denied = False
    applicant = db.users.find({'token': token})
    if applicant.count() == 0:
        access_denied = True
    else:
        for item in applicant:
            if item['type'] not in ['hr', 'interviewer']:
                access_denied = True
                break
    if access_denied:
        return Response(
            {
                'status': '30',
                'error': 'Permission denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    # Set path record
    # TODO: Should there be more than one report for each candidate?

    report_id = str(uuid.uuid4())
    while db.report.find({'report_id': report_id}).count() > 0:
        report_id = str(uuid.uuid4())
    report_path =  os.path.join(settings.REPORT_PATH, report_id)
    tex_file_path = os.path.join(settings.TEX_PATH, report_id)
    db.report.insert_one(
        {
            'candidate_id': report_data['candidate_id'],
            'report_id': report_id,
            'path': report_path + '.pdf'
        }
    )

    # Write report

    with open(tex_file_path + '.tex', 'w') as f:
        # TODO: Write a report template here

    subprocess.call('xelatex ' + report_path + '.tex -output-directory=' + settings.REPORT_PATH)

    return Response(
        {
            'id': report_id,
            'roomId': report_data['candidate_id'],
            'text': report_data['text']
        }
    )


