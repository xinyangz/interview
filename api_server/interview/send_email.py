# -*- encoding: utf-8 -*-

import smtplib
from email.mime.text import MIMEText
from django.conf import settings


def send_text(sender, receiver, subject, body):
    msg = MIMEText(body, _charset='utf-8')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = receiver
    msg["Accept-Language"] = "zh-CN"
    msg["Accept-Charset"] = "ISO-8859-1,utf-8"

    s = smtplib.SMTP('localhost')
    s.sendmail(sender, [receiver], msg.as_string())
    s.quit()


def send_invitation(receiver, subject, body):
    send_text(
        settings.INVITATION_SENDER + '@' + settings.EMAIL_DOMAIN,
        receiver,
        subject,
        body
    )


def send_candidate_invitation(receiver, l, r):
    send_invitation(
        receiver,
        u'邀请您接受面试',
        u'请点击链接：' + generate_invitation_url(l, r) + u' 进入面试房间。'
    )


def send_interviewer_invitation(receiver, l, r):
    send_invitation(
        receiver,
        u'邀请您作为主考官参加面试',
        u'请点击链接：' + generate_invitation_url(l, r) + u' 进入面试房间。'
    )


def generate_invitation_url(l, r):
    return settings.SITE_URL + '/redirect?l=' + l + '&r=' + r
