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
    return axios.post('/problem/room/' + roomId + '?token=' + token, {
      problem
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(loadAllProblems(roomId));
        }
        else if (res.status === 403) {
          dispatch(addProblemError('用户无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(addProblemError('房间不存在'));
        }
        else {
          dispatch(addProblemError(res.data));
        }
      })
      .catch(err => {
          dispatch(addProblemError(err));
        }
      );
  };
}

export function editProblem(problem) {
  return (dispatch, getState) => {
    dispatch(beginEditProblem(problem));
    const token = getState().user.token;
    const roomId = getState().roomsStates.room.id;
    const problemId = problem.id;
    return axios.put('/problem/' + problemId + '?token=' + token, {
      problem
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(loadAllProblems(roomId));
        }
        else if (res.status === 403) {
          dispatch(editProblemError('用户无访问权限'));
        }
        else if (res.status === 404) {
          dispatch(editProblemError('房间不存在'));
        }
        else {
          dispatch(editProblemError(res.data));
        }
      })
      .catch(err => {
          dispatch(editProblemError(err));
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
          dispatch(loadAllProblemsError(res.data));
        }
      })
      .catch(err => {
        dispatch(loadAllProblemsError(err));
      });
  };
}
