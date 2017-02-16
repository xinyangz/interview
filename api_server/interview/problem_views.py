#!/usr/bin/env python
# encoding: utf-8

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import jsonschema
from . import permissions
from .schemas import swagger_schema
from . import sequences
import pymongo


@api_view(['GET', 'POST'])
def root(request, room_id, **kwargs):
    '''
    Get and set problems for a certain room.
    '''

    # Perimission check
    permitted_user_types = ['hr', 'interviewer']
    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission Denied'},
            status.HTTP_403_FORBIDDEN
        )
    room_id = int(room_id)
    if request.method == 'POST':
        # Format check
        problem_data = dict(request.data)
        try:
            tmp_schema = swagger_schema['definitions']['Problem'].copy()
            tmp_schema['required'] = [
                "roomId",
                "type",
                "content"
            ]
            jsonschema.validate(problem_data,
                                tmp_schema)
        except:
            return Response(
                {'error': "Key error"},
                status.HTTP_400_BAD_REQUEST
            )
        problem_id = sequences.get_next_sequence('problem_id')
        client = pymongo.MongoClient()
        db = client[settings.DB_NAME]
        problem_data['id'] = problem_id

        # Validation. Should never happen.
        # if room_id != problem_data['roomId']:
        #    return Response(
        #        {'error': 'Unknown error'},
        #        status.HTTP_400_BAD_REQUEST
        #    )
        # Check existance
        room_cursor = db.rooms.find({'id': room_id})
        if room_cursor.count() == 0:
            return Response(
                {'error': "roomId error"},
                status.HTTP_400_BAD_REQUEST
            )
        room = room_cursor[0]
        room['problems'].append(problem_id)
        db.rooms.update_one(
            {'id': room_id}, {'$set': {'problems': room['problems']}}
        )
        db.problems.insert_one(problem_data)
        if '_id' in problem_data:
            del problem_data['_id']
        return Response(
            problem_data,
            status.HTTP_200_OK
        )

    elif request.method == 'GET':
        client = pymongo.MongoClient()
        db = client[settings.DB_NAME]
        offset = request.GET.get('offset')
        limit = request.GET.get('limit')
        _offset = offset
        _limit = limit
        # Check query parameters
        offset = 0 if offset is None or offset == ' ' else int(offset)
        limit = 1 if limit is None or limit == '' else int(limit)

        # Check room existance
        room_cursor = db.rooms.find({'id': room_id})
        if room_cursor.count() == 0:
            return Response(
                {'error': "roomId error"},
                status.HTTP_400_BAD_REQUEST
            )
        room = room_cursor[0]
        problems_list = room['problems']
        if problems_list is None or len(problems_list) == 0 or \
                len(problems_list) < offset:
            return Response(
                {'offset': offset, 'limit': limit, 'problems': []},
                status.HTTP_200_OK
            )
        else:
            sorted_problem_list = sorted(problems_list)
            if len(problems_list) <= offset + limit:
                limit = len(problems_list) - offset
            response_problem_list = []
            for index in range(offset, offset + limit):
                problem_cursor = db.problems.find(
                    {'id': sorted_problem_list[index]}
                )
                # Should never happen
                if problem_cursor.count() == 0 or problem_cursor.count() > 1:
                    return Response(
                        {'error': "No such problem record."},
                        status.HTTP_404_NOT_FOUND
                    )
                update_problem = problem_cursor[0]
                if '_id' in update_problem:
                    del update_problem['_id']
                response_problem_list.append(update_problem)
            return Response(
                {
                    'offset': _offset,
                    'limit': _limit,
                    'problems': response_problem_list,
                },
                status.HTTP_200_OK
            )
    else:
        return Response(
            {'error': "Illegal request method"},
            status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'DELETE'])
def manage(request, problem_id, **kwargs):
    '''
    Manage problems directly according to problem id.
    '''
    # Check permission
    permitted_user_types = ['hr', 'interviewer']
    if permissions.check(request, permitted_user_types) != permissions.PASS:
        return Response(
            {'error': 'Permission denied'},
            status.HTTP_403_FORBIDDEN
        )

    client = pymongo.MongoClient()
    db = client[settings.DB_NAME]

    problem_id = int(problem_id)
    problem_cursor = db.problems.find({'id': problem_id})
    if problem_cursor.count() == 0:
        return Response(
            {'error': 'Problem not found.'},
            status.HTTP_404_NOT_FOUND
        )
    elif problem_cursor.count() > 1:  # Which should never happen
        return Response(
            {'error': 'Problem id duplicated.'},
            status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'DELETE':
        problem = problem_cursor[0]
        room_id = problem['roomId']
        room_cursor = db.rooms.find({'id': room_id})
        if room_cursor.count() == 0:
            pass
        else:
            for room in room_cursor:
                updated_room = room
                updated_room['problems'].remove(problem_id)
                db.rooms.update_one(
                    {'id': room['id']},
                    {
                        '$set': updated_room
                    }
                )
        db.problems.delete_one({'id': problem_id})
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'GET':
        problem = problem_cursor[0]
        if '_id' in problem:
            del problem['_id']
        return Response(
            problem,
            status.HTTP_200_OK
        )
    elif request.method == 'PUT':
        problem = problem_cursor[0]
        update_data = dict(request.data)

        # Validation. Should never happen.
        if problem_id != update_data['id']:
            return Response(
                {'error': 'Unknown error'},
                status.HTTP_400_BAD_REQUEST
            )

        # An restriction
        if update_data['roomId'] != problem['roomId']:
            return Response(
                {'error': 'Unknown error(roomid doesn\'t match)'},
                status.HTTP_400_BAD_REQUEST
            )

        try:
            jsonschema.validate(update_data,
                                swagger_schema['definitions']['Problem'])
        except:
            return Response(
                {'error': 'Key error'},
                status.HTTP_400_BAD_REQUEST
            )

        db.problems.update_one(
            {'id': problem_id},
            {'$set': update_data}
        )

        return Response(
            update_data,
            status.HTTP_200_OK
        )
