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
        pdf_bytes = img2pdf.convert(os.path.join(logo_dir, 'logo.jpg'))
        with open(os.path.join(logo_dir, 'logo.pdf'), 'wb') as f:
            f.write(pdf_bytes)
    if weak_in('logo.pdf', os.listdir(logo_dir)):
        logo = os.path.join(logo_dir, 'logo.pdf')
    else:
        logo = settings.TEX_PATH + "logo/iitmlogo.pdf"

    # Write report

    lines = []
    reshading_macro_prefix = "\\vspace{8pt} \n\\parbox{\\textwidth}\
                              {\\setlength{\\FrameSep}{\\outerbordwidth}\
                              \n\\begin{shaded}\n\\setlength{\\fboxsep}{0pt}\
                              \\framebox[\\textwidth][l]{\\setlength\
                              {\\fboxsep}{4pt}\\fcolorbox{shadecolorB}\
                              {shadecolorB}{\\textbf{\\sffamily{\\mbox{~}\
                              \\makebox[6.762in][l]{"
    reshading_macro_suffix = "} \\vphantom{p\\^{E}}}}}}\n\\end{shaded}}\n\
                              \\vspace{-5pt}\n"
    with open(settings.TEX_PATH + 'header/header.tex', 'r') as fheader:
        # Warning: Dirty implementations so sad;(, fix later
        lines.append(fheader.read())
        lines.append("\\begin{document}\n")
        lines.append("\\begin{tabular*}{7in}{l@{\extracolsep{\\fill}}r}\n")
        lines.append(" & \\multirow{4}{*}{\includegraphics[scale=0.19]{" +
                     logo + "}} \\\\\n")
        lines.append(" & \\\\\n")
        lines.append("\\textbf{\Large " + candidate_name + "$|$" +
                     str(candidate_id) + "} & \\\\\n")
        lines.append(candidate_organization + "& \\\\\n")
        lines.append(candidate_phone + "& \\\\\n")
        lines.append(candidate_email + "& \\\\\n")
        lines.append(candidate_contact + "\\\\\n")
        lines.append("\\end{tabular*} \\\\\n")
        lines.append(reshading_macro_prefix + "\\Large{面试结果：" +
                     candidate_status + "}" + reshading_macro_suffix)
        lines.append("\\rule[3pt]{17.8cm}{0.05em}\n")
        lines.append(reshading_macro_prefix + "\\large{HR与面试官信息}" +
                     reshading_macro_suffix)
        lines.append("\\begin{itemize}\n")
        lines.append("\\item\n")
        lines.append("    \\ressubheading{HR}{}{HR\\_name}{HR\\_email}\n")
        lines.append("\\item\n")
        lines.append(u"    \\ressubheading{面试官}{}{" +
                     interviewer_name +
                     "}{Interviewer\\_email}\n")
        lines.append("\\end{itemize}\n")
        lines.append(reshading_macro_prefix + "\\large{面试记录与面试官评价} " +
                     reshading_macro_suffix)
        lines.append("    \\begin{center}\n")
        lines.append("    \\parbox{6.762in}{" + report_data + "}\n")
        lines.append("\\end{center}\n")

        if len(choice) + len(blank) + len(code) + len(answer) > 0:
            lines.append(reshading_macro_prefix +
                         "\\large{面试题记录（文字部分）}" +
                         reshading_macro_suffix)
            lines.append("\\begin{itemize}\n")
            lines.append("\\item\n")
            if len(choice) > 0:
                lines.append("    \\ressubheading{选择题}{}{Multiple choice}{}\n")
                lines.append("    \\begin{itemize}\n")
                for item_choice in choice:
                    content = item_choice['content']
                    title = content['title']
                    lines.append("        \\resitem{" + title + "}\n")
                lines.append("    \\end{itemize}\n")
            if len(blank) > 0:
                lines.append("    \\ressubheading{填空题}{}\
                              {Fill in the blank}{}\n")
                for item_blank in blank:
                    content = item_blank['content']
                    title = content['title']
                    lines.append("        \\resitem{" + title + "}\n")
                lines.append("    \\begin{itemize}\n")
                lines.append("        \\resitem{title1}\n")
                lines.append("    \\end{itemize}\n")
            if len(code) > 0:
                lines.append("    \\ressubheading{编程题}{}{Coding}{}\n")
                for item_code in code:
                    content = item_code['content']
                    title = content['title']
                    lines.append("        \\resitem{" + title + "}\n")
                lines.append("    \\begin{itemize}\n")
                lines.append("        \\resitem{title1}\n")
                lines.append("    \\end{itemize}\n")
            if len(answer) > 0:
                lines.append("    \\ressubheading{简答题}{}\
                             {Answer questions}{}\n")
                for item_answer in answer:
                    content = item_answer['content']
                    title = content['title']
                    lines.append("        \\resitem{" + title + "}\n")
                lines.append("    \\begin{itemize}\n")
                lines.append("        \\resitem{title1}\n")
                lines.append("    \\end{itemize}\n")
            lines.append("\\end{itemize}\n")

        lines.append(reshading_macro_prefix +
                     "\\large{面试题记录（视频与音频部分）}" +
                     reshading_macro_suffix)
        lines.append("\\begin{itemize}\n")
        lines.append("\\item\n")
        lines.append("    白板记录\n")
        lines.append("    \\begin{itemize}\n")
        lines.append("        \\resitem{{\\bf File} " +
                     candidate_board + "}\n")
        lines.append("    \\end{itemize}\n")
        lines.append("\\item\n")
        lines.append("    视频文件\n")
        lines.append("    \\begin{itemize}\n")
        lines.append("        \\resitem{{\\bf File} " +
                     candidate_video + "}\n")
        lines.append("    \\end{itemize}\n")
        lines.append("\\end{itemize}\n")
        lines.append("\\end{document}\n")

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
