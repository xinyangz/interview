import * as types from '../constants/actionTypes';
import axios from 'axios';
import {displayNotification} from './notificationActions';
import {loadAllRooms} from './roomsActions';

// token should be read from state
const offset = '0';
const limit = '100';

export function beginDeleteCandidate() {
  return {
    type: types.DELETE_CANDIDATE_BEGIN,
  };
}

export function deleteCandidateSuccess(candidateId) {
  return {
    type: types.DELETE_CANDIDATE_SUCCESS,
    candidateId
  };
}

export function deleteCandidateError(error) {
  return {
    type: types.DELETE_CANDIDATE_ERROR,
    error
  };
}

export function beginEditCandidate() {
  return {
    type: types.EDIT_CANDIDATE_BEGIN,
  };
}

export function editCandidateSuccess(candidateId) {
  return {
    type: types.EDIT_CANDIDATE_SUCCESS,
    candidateId
  };
}

export function editCandidateError(error) {
  return {
    type: types.EDIT_CANDIDATE_ERROR,
    error
  };
}

export function beginLoadAllCandidates() {
  return {
    type: types.LOAD_ALL_CANDIDATE_BEGIN
  };
}

export function loadAllCandidatesSuccess(candidates) {
  return {
    type: types.LOAD_ALL_CANDIDATE_SUCCESS,
    candidates
  };
}

export function loadAllCandidatesError(error) {
  return {
    type: types.LOAD_ALL_CANDIDATE_ERROR,
    error
  };
}

export function addCandidateBegin() {
  return {
    type: types.ADD_CANDIDATE_BEGIN
  };
}

export function addCandidateSuccess(candidates) {
  return {
    type: types.ADD_CANDIDATE_SUCCESS,
    candidates
  };
}

export function addCandidateError(error) {
  return {
    type: types.ADD_CANDIDATE_ERROR,
    error
  };
}

export function listCandidateBegin() {
  return {
    type: types.LIST_CANDIDATE_BEGIN
  };
}

export function listCandidateSuccess(candidates) {
  return {
    type: types.LIST_CANDIDATE_SUCCESS,
    candidates
  };
}

export function listCandidateError(error) {
  return {
    type: types.LIST_CANDIDATE_ERROR,
    error
  };
}

export function loadTemplateSuccess(data) {
  return {
    type: types.LOAD_TEMPLATE_SUCCESS,
    csv: data.csv,
    xlsx: data.xlsx,
  };
}

export function deleteCandidate(candidateId) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(beginDeleteCandidate());
    return axios.delete('/candidate/' + candidateId + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteCandidateSuccess(candidateId));
          dispatch(loadAllRooms());
          dispatch(displayNotification('success', '操作成功', '候选人已删除'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error))));
  };
}

export function editCandidate(candidate) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(beginEditCandidate());
    return axios.put('/candidate/' + candidate.id + '?token=' + token, candidate)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidates());
          dispatch(loadAllRooms());
          dispatch(displayNotification('success', '操作成功', '候选人信息已修改'));
        }
        else {
          dispatch(editCandidateError(response.data.error));
        }
      })
      .catch(error => dispatch(editCandidateError(error)));
  };
}

export function addCandidate(candidate) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(addCandidateBegin());
    return axios.post('/candidate?token=' + token, candidate)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidates());
          dispatch(loadAllRooms());
          dispatch(displayNotification('success', '操作成功', '候选人已添加'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error))));
  };
}

export function listCandidate(fileContent) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(listCandidateBegin());
    return axios.post('/candidate/file?token=' + token, fileContent)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidates());
          dispatch(displayNotification('success', '操作成功', '候选人列表已添加'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', '候选人列表添加失败，请导入正确的文件')));
  };
}

export function loadAllCandidates() {
  return (dispatch, getState) => {
    const token = getState().user.token;
    dispatch(beginLoadAllCandidates());
    return axios.get('/candidate' + '?offset='+ offset + '&limit=' + limit + '&token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidatesSuccess(response.data.candidates));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error))));
  };
}

export function loadAllRoomCandidates(roomId) {
  return (dispatch, getState) => {
    const token = getState().user.token;
    console.log(getState().roomsStates);
    return axios.get('/candidate/room/' + roomId + '?token=' + token + '&offset=' + offset + '&limit=' + limit)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidatesSuccess(response.data.candidates));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error))));
    };
}

export function loadTemplate() {
  return (dispatch, getState) => {
    const token = getState().user.token;
    return axios.get('/candidate/file?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadTemplateSuccess(response.data));
        }
        else {
          dispatch(displayNotification('error', '错误', '不能读取批量添加候选人样例文件'));
        }
      })
      .catch(error => {
        dispatch(displayNotification('error', '错误', '不能读取批量添加候选人样例文件'));
      });
  };
}

