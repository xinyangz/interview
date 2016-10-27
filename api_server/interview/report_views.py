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

@api_view(['PUT'])
def put_report(request, candidate_id, **kwargs):

    '''
    'id': '7001',
    'roomId': '101',
    'text': 'string'
    '''

    report_data = request.data
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

    # Set path record
    # TODO: Should there be more than one report for each candidate?

    report_id = str(uuid.uuid4())
    while db.report.find({'report_id': report_id}).count() > 0:
        report_id = str(uuid.uuid4())
    report_path =  os.path.join(settings.REPORT_PATH, report_id)
    tex_file_path = os.path.join(settings.TEX_PATH, report_id)
    db.report.insert_one(
        {
            'candidate_id': candidate_id,
            'report_id': report_id,
            'path': report_path + '.pdf'
        }
    )
    # TODO: ???
    #db.candidate.update({'id': report_data['candidate_id']}, {'$set': {report_id}})

    # Get related data from 3 collections
    candidate_candidate_data = db.candidate.find_one({'id': candidate_id})
    user_name = candidate_candidate_data['unique_username']
    candidate_user_data = db.users.find_one({'username': user_name})

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

    room_id = candidate_candidate_data['roomId']
    room_data = db.room.find_one({'id': room_id})
    interviewer_name = room_data['interviewer']
    logo = room_data['logo']

    # TODO: Where is the logo? room_data['logo'] returns what?
    logo = settings.TEX_PATH + "logo/iitmlogo.pdf"


    # Write report

    lines = []
    reshading_macro_prefix = "\\vspace{8pt} \n\\parbox{\\textwidth}{\\setlength{\\FrameSep}{\\outerbordwidth} \n\\begin{shaded}\n\\setlength{\\fboxsep}{0pt}\\framebox[\\textwidth][l]{\\setlength{\\fboxsep}{4pt}\\fcolorbox{shadecolorB}{shadecolorB}{\\textbf{\\sffamily{\\mbox{~}\\makebox[6.762in][l]{"
    reshading_macro_suffix = "} \\vphantom{p\\^{E}}}}}}\n\\end{shaded}}\n\\vspace{-5pt}\n"
    with open(settings.TEX_PATH + 'header/header.tex', 'r') as fheader:
            # Warning: Dirty implementations
        lines.append(fheader.read())
        lines.append("\\begin{document}\n")
        lines.append("\\begin{tabular*}{7in}{l@{\extracolsep{\\fill}}r}\n")
        lines.append(" & \\multirow{4}{*}{\includegraphics[scale=0.19]{" + logo + "}} \\\\\n")
        lines.append(" & \\\\\n")
        lines.append("\\textbf{\Large " + candidate_name + "$|$" + candidate_id + "} & \\\\\n")
        lines.append(candidate_organization + "& \\\\\n")
        lines.append(candidate_phone + "& \\\\\n")
        lines.append(candidate_email + "& \\\\\n")
        lines.append(candidate_contact + "\\\\\n")
        lines.append("\\end{tabular*} \\\\\n")
        lines.append(reshading_macro_prefix + "\\Large{面试结果：" + candidate_status + "}" + reshading_macro_suffix)
        lines.append("\\rule[3pt]{17.8cm}{0.05em}\n")
        lines.append(reshading_macro_prefix + "\\large{HR与面试官信息}" + reshading_macro_suffix)
        lines.append("\\begin{itemize}\n")
        lines.append("\\item\n")
        lines.append("    \\ressubheading{HR}{}{HR\\_name}{HR\\_email}\n")
        lines.append("\\item\n")
        lines.append(u"    \\ressubheading{面试官}{}{" + interviewer_name + "}{Interviewer\\_email}\n")
        lines.append("\\end{itemize}\n")
        lines.append(reshading_macro_prefix + "\\large{面试记录与面试官评价} " + reshading_macro_suffix)
        lines.append("    \\begin{center}\n")
        lines.append("    \\parbox{6.762in}{" + report_data + "}\n")
        lines.append("\\end{center}\n")

        lines.append(reshading_macro_prefix + "\\large{面试题记录（文字部分）}" + reshading_macro_suffix)
        #lines.append("\\begin{itemize}\n")
        #lines.append("\\item\n")
        # TODO: Question format
        # lines.append("    \\ressubheading{选择题}{}{Passed}{}")
        # lines.append("    \\begin{itemize}")
        # lines.append("        \\resitem{title1}")
        # lines.append("    \\end{itemize}")

        lines.append(reshading_macro_prefix + "\\large{面试题记录（视频与音频部分）}" + reshading_macro_suffix)
        lines.append("\\begin{itemize}\n")
        lines.append("\\item\n")
        lines.append("    白板记录\n")
        lines.append("    \\begin{itemize}\n")
        lines.append("        \\resitem{{\\bf File} " + candidate_board + "}\n")
        lines.append("    \\end{itemize}\n")
        lines.append("\\item\n")
        lines.append("    视频文件\n")
        lines.append("    \\begin{itemize}\n")
        lines.append("        \\resitem{{\\bf File} " + candidate_video + "}\n")
        lines.append("    \\end{itemize}\n")
        lines.append("\\end{itemize}\n")

        lines.append("\\end{document}\n")

    lines = map(lambda x: x.encode('utf-8'), lines)

    tex_path = settings.TEX_PATH + str(report_id) + ".tex"
    with open(settings.TEX_PATH + str(report_id) + ".tex", 'w') as f:
        f.writelines(lines)

    subprocess.call('xelatex ' + tex_path + ' -output-directory=' + settings.REPORT_PATH + ' -aux-directory=report/ && sh clean.sh', shell=True)

    return Response(
        {
            'id': report_id,
            'roomId': candidate_id,
            'text': report_data
        },
        status.HTTP_200_OK
    )


