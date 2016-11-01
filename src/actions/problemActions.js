import * as types from '../constants/actionTypes';
import axios from 'axios';

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
  // DEBUG
  console.log(error);
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
  }
}

export function beginDeleteProblem() {
  return {
    type: types.DELETE_PROBLEM
  }
}

export function deleteProblem(problemId) {
  return (dispatch, getState) => {
    dispatch(beginDeleteProblem());
    // TODO: fetch token from store
    const token = "233";
    return axios.delete('/problem/' + problemId, {
      params: {
        token
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(deleteProblemSuccess(problemId));
        }
        else if (res.status === 403) {
          dispatch(deleteProblemError('用户无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(deleteProblemError('面试题不存在'));
        }
        else {
          dispatch(deleteProblemError(res.data));
        }
      })
      .catch(err => {
        dispatch(deleteProblemError(err));
      })
  }
}

export function loadAllProblems(roomId) {
  return (dispatch, getState) => {
    // TODO: fetch token from store
    const token = "123";
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
          dispatch(loadAllProblemsError(res.data));
        }
      })
      .catch(err => {
        dispatch(loadAllProblemsError(err));
      });
  };
}
