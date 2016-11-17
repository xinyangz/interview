import * as types from '../constants/actionTypes';
import axios from 'axios';
import {displayNotification} from './notificationActions';

export function beginLoadAllProblems() {
  return {
    type: types.LOAD_ALL_PROBLEMS
  };
}

export function loadAllProblemsSuccess(problems) {
  return {
    type: types.LOAD_ALL_PROBLEMS_SUCCESS,
    problems
  };
}

export function loadAllProblemsError(error) {
  return {
    type: types.LOAD_ALL_PROBLEMS_ERROR,
    error
  };
}

export function deleteProblemSuccess(problemId) {
  return {
    type: types.DELETE_PROBLEM_SUCCESS,
    problemId
  };
}

export function deleteProblemError(error) {
  return {
    type: types.DELETE_PROBLEM_ERROR,
    error
  };
}

export function beginDeleteProblem() {
  return {
    type: types.DELETE_PROBLEM
  };
}

export function beginAddProblem(problem) {
  return {
    type: types.ADD_PROBLEM,
    problem
  };
}

export function addProblemError(error) {
  return {
    type: types.ADD_PROBLEM_ERROR,
    error
  };
}

export function beginEditProblem(problem) {
  return {
    type: types.EDIT_PROBLEM,
    problem
  };
}

export function editProblemError(error) {
  return {
    type: types.EDIT_PROBLEM_ERROR,
    error
  };
}

export function addProblem(problem) {
  return (dispatch, getState) => {
    dispatch(beginAddProblem(problem));
    const token = getState().user.token;
    const roomId = getState().roomsStates.room.id;
    return axios.post('/problem/room/' + roomId + '?token=' + token, problem)
      .then(res => {
        if (res.status === 200) {
          dispatch(displayNotification('success', '操作成功', '题目添加成功'));
          dispatch(loadAllProblems(roomId));
        }
        else if (res.status === 403) {
          dispatch(displayNotification('error', '错误', '您无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(displayNotification('error', '错误', '题目不存在'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(res.data)));
        }
      })
      .catch(err => {
          dispatch(displayNotification('error', '错误', toString(err)));
        }
      );
  };
}

export function editProblem(problem) {
  return (dispatch, getState) => {
    dispatch(beginEditProblem(problem));
    const token = getState().user.token;
    const roomId = problem.roomId;
    const problemId = problem.id;
    return axios.put('/problem/' + problemId + '?token=' + token, problem)
      .then(res => {
        if (res.status === 200) {
          dispatch(displayNotification('success', '操作成功', '题目修改成功'));
          dispatch(loadAllProblems(roomId));
        }
        else if (res.status === 403) {
          dispatch(displayNotification('error', '错误', '您无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(displayNotification('error', '错误', '题目不存在'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(res.data)));
        }
      })
      .catch(err => {
        dispatch(displayNotification('error', '错误', toString(err)));
        }
      );
  };
}

export function deleteProblem(problemId) {
  return (dispatch, getState) => {
    dispatch(beginDeleteProblem());
    const token = getState().user.token;
    return axios.delete('/problem/' + problemId, {
      params: {
        token
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(displayNotification('success', '操作成功', '题目删除成功'));
          dispatch(deleteProblemSuccess(problemId));
        }
        else if (res.status === 403) {
          dispatch(displayNotification('error', '错误', '您无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(displayNotification('error', '错误', '题目不存在'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(res.data)));
        }
      })
      .catch(err => {
        dispatch(displayNotification('error', '错误', toString(err)));
      });
  };
}

export function loadAllProblems(roomId) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(beginLoadAllProblems());
    return axios.get('/problem/room/' + roomId, {
      params: {
        token,
        offset: 0,
        limit: 10
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(loadAllProblemsSuccess(res.data.problems));
        }
        else if (res.status === 403) {
          dispatch(loadAllProblemsError('用户无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(loadAllProblemsError('房间不存在'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(res.data)));
        }
      })
      .catch(err => {
        dispatch(displayNotification('error', '错误', err.message));
      });
  };
}
