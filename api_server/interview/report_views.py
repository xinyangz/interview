# -*- encoding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import pymongo
import uuid
import subprocess
import os


@api_view(['GET', 'DELETE', 'PUT'])
def all_report(request, candidate_id, **kwargs):
    method = request.method

    if method == 'GET':
        return get_report(request, candidate_id)
    elif method == 'DELETE':
        return delete_report(request, candidate_id)
    elif method == 'PUT':
        return put_report(request, candidate_id)
    else:
        return Response(
            {
                'error': 'Method error'
            },
            status.HTTP_400_BAD_REQUEST
        )


def get_report(request, candidate_id):
    candidate_id = int(candidate_id)
    token = request.GET.get('token')
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
    report_cursor = db.report.find({'candidate_id': candidate_id})
    if report_cursor.count() == 0:
        return Response(
            {
                'error': 'Candidate not found'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif report_cursor.count() > 1:
        return Response(
            {
                'error': 'Duplicate in database'
            },
            status.HTTP_404_NOT_FOUND
        )
    else:
        for report in report_cursor:
            return Response({
                'id': report['report_id'],
                'candidateId': candidate_id,
                'url': report['path']
            }, status.HTTP_200_OK)


def delete_report(request, candidate_id):
    candidate_id = int(candidate_id)
    token = request.GET.get('token')
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
    user_cursor = db.candidate.find({'id': candidate_id})
    if user_cursor.count() == 0:
        return Response(
            {
                'error': 'Candidate not found'
            },
            status.HTTP_404_NOT_FOUND
        )
    elif user_cursor.count() > 1:
        return Response(
            {
                'error': 'Duplicate in database'
            },
            status.HTTP_404_NOT_FOUND
        )
    else:
        report_cursor = db.report.find({'candidate_id': candidate_id})
        if report_cursor.count() == 0:
            return Response(
                {
                    'error': 'No such report!'
                },
                status.HTTP_404_NOT_FOUND
            )
        elif report_cursor.count() > 1:
            return Response(
                {
                    'error': 'Report duplicated!'
                },
                status.HTTP_404_NOT_FOUND
            )
        else:
            for report in report_cursor:
                subprocess.call("rm " + report['path'], shell=True)
                db.report.delete_one({'candidate_id': candidate_id})
                return Response(
                    {
                        'candidate_id': candidate_id,
                        'token': token
                    },
                    status.HTTP_200_OK
                )


def put_report(request, candidate_id):

    '''
    'id': '7001',
    'roomId': '101',
    'text': 'string'
    '''

    report_data = request.data
    text = report_data
    candidate_id = int(candidate_id)
    token = request.GET.get('token')

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
                'error': 'Permission denied.'
            },
            status.HTTP_403_FORBIDDEN
        )

    # Set path record

    report_id = str(uuid.uuid4())
    while db.report.find({'report_id': report_id}).count() > 0:
        report_id = str(uuid.uuid4())
    report_path = os.path.join(settings.REPORT_PATH, report_id)
    db.report.insert_one(
        {
            'candidate_id': candidate_id,
            'report_id': report_id,
            'path': report_path + '.pdf'
        }
    )
    # Get related data from 3 collections
    candidate_candidate_data = db.candidate.find({'id': candidate_id})[0]
    user_name = candidate_candidate_data['unique_username']
    candidate_user_data = db.users.find_one({'username': user_name})

    # Update text
    db.candidate.update(
        {'candidate_id': candidate_id},
        {
            "$set":
            {
                'record':
                {
                    'video': candidate_candidate_data['record']['video'],
                    'board': candidate_candidate_data['record']['board'],
                    'chat': candidate_candidate_data['record']['chat'],
                    'code': candidate_candidate_data['record']['code'],
                    'report': text
                }
            }
        }
    )
    candidate_candidate_data = db.candidate.find_one({'id': candidate_id})

    candidate_name = candidate_candidate_data['name']
    candidate_id = candidate_id
    candidate_organization = candidate_user_data['organization']
    candidate_contact = candidate_user_data['contact']
    candidate_phone = candidate_candidate_data['phone']
    candidate_email = candidate_candidate_data['email']
    candidate_status = candidate_candidate_data['status']

    candidate_video = candidate_candidate_data['record']['video']
    candidate_board = candidate_candidate_data['record']['board']
    candidate_chat = candidate_candidate_data['record']['chat']
    candidate_code = candidate_candidate_data['record']['code']
    candidate_text = candidate_candidate_data['record']['report']

    room_id = candidate_candidate_data['roomId']
    room_data = db.room.find_one({'id': room_id})
    interviewer_name = room_data['interviewer']
    if 'problems' in room_data:
        problems = room_data['problems']
    else:
        problems = []
    choice, blank, answer, code = [], [], [], []
    for problem_index in problems:
        try:
            problem = db.problems.find_one({'id': problem_index})
            if problem['type'] == 'choice':
                choice.append(problem)
            elif problem['type'] == 'blank':
                blank.append(problem)
            elif problem['type'] == 'answer':
                answer.append(problem)
            elif problem['type'] == 'code':
                code.append(problem)
            else:
                pass
        except:
            pass
    logo_dir = os.path.join(settings.FILE_ROOT, str(room_id))

    def weak_in(name, _list):
        for item in _list:
            if name == item:
                return True
        return False

    if weak_in('logo.pdf', os.listdir(logo_dir)):
        import img2pdf
        print (os.path.join(logo_dir, 'logo.jpg'))
        pdf_bytes = img2pdf.convert(os.path.join(logo_dir, 'logo.jpg'))
        with open(os.path.join(logo_dir, 'logo.pdf'), 'wb') as f:
            f.write(pdf_bytes)
    if weak_in('logo.pdf', os.listdir(logo_dir)):
        logo = os.path.join(logo_dir, 'logo.pdf')
    else:
        logo = settings.TEX_PATH + "logo/iitmlogo.pdf"

    # Write report

    template_file = json.load(open(settings.TEX_PATH + 'header/template.json'), 'r')
    header = open('serrings.TEX_PATH + header/header.tex', 'r').read()
    lines = template_file['template']
    reshading_macro_prefix = template_file['prefix']
    reshading_macro_suffix = template_file['suffix']
    record_item = ''
    choice_items = ''
    blank_items = ''
    code_items = ''
    answer_items = ''


    def replace_token(token, content, target=lines):
        target = [content if x == token else x for x in target]

    replace_token('[REPLACE_HEADER]', header)
    replace_token('[REPLACE_LOGO]', logo)
    replace_token('[REPLACE_CANDIDATE_NAME]', candidate_name)
    replace_token('[REPLACE_CANDIDATE_ID]', candidate_id)
    replace_token('[REPLACE_CANDIDATE_ORGANIZATION]', candidate_organization)
    replace_token('[REPLACE_CANDIDATE_PHONE]', candidate_phone)
    replace_token('[REPLACE_CANDIDATE_EMAIL]', candidate_email)
    replace_token('[REPLACE_CANDIDATE_CONTACT]', candidate_contact)
    replace_token('[REPLACE_CANDIDATE_STATUS]', candidate_status)
    replace_token('[REPLACE_INTERVIEWER_NAME]', interviewer_name)
    replace_token('[REPLACE_REPORT_DATA]', report_data)

    if len(choice) + len(blank) + len(code) + len(answer) > 0:
        record_item = template_file['record']

        if len(choice) > 0:
            choice_items = template_file['record_choice']
            tmp = ''
            for item_choice in choice:
                content = item_choice['content']
                title = content['title']
                tmp += "        \\resitem{" + title + "}\n"
            replace_token('[REPLACE_CHOICE_ITEMS]', tmp, choice_items)
            replace_token('[REPLACE_CHOICE]', ''.join(choice_items), record_item)

        if len(blank) > 0:
            blank_items = template_file['record_blank']
            tmp = ''
            for item_blank in blank:
                content = item_blank['content']
                title = content['title']
                tmp += "        \\resitem{" + title + "}\n"
            replace_token('[REPLACE_BLANK_ITEMS]', tmp, blank_items)
            replace_token('[REPLACE_BLANK]', ''.join(blank_items), record_item)

        if len(code) > 0:
            code_items = template_file['record_code']
            tmp = ''
            for item_code in code:
                content = item_code['content']
                title = content['title']
                tmp += "        \\resitem{" + title + "}\n"
            replace_token('[REPLACE_CODE_ITEMS]', tmp, code_items)
            replace_token('[REPLACE_CODE]', ''.join(code_items), record_item)

        if len(answer) > 0:
            answer_items = template_file['record_answer']
            tmp = ''
            for item_answer in answer:
                content = item_blank['content']
                title = content['title']
                tmp += "        \\resitem{" + title + "}\n"
            replace_token('[REPLACE_ANSWER_ITEMS]', tmp, answer_items)
            replace_token('[REPLACE_ANSWER]', ''.join(answer_items), record_item)

    replace_token('[REPLACE_RECORD]', ''.join(record_item))

    replace_token('[RESHADING_MACRO_PREFIX]', reshading_macro_prefix)
    replace_token('[RESHADING_MACRO_SUFFIX]', reshading_macro_suffix)

    lines = map(lambda x: x.encode('utf-8'), lines)

    tex_path = settings.TEX_PATH + str(report_id) + ".tex"
    with open(settings.TEX_PATH + str(report_id) + ".tex", 'wb') as f:
        f.writelines(lines)

    subprocess.call('/Library/TeX/texbin/xelatex ' + tex_path +
                    ' -output-directory=' + settings.REPORT_PATH +
                    ' -aux-directory=report/', shell=True)
    subprocess.call('sh clean.sh', shell=True)

    return Response(
        {
            'id': report_id,
            'roomId': candidate_id,
            'text': report_data
        },
        status.HTTP_200_OK
    )
