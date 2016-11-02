/**
 * Created by 薛凯韬 on 2016/11/2.
 */
import * as types from './Consts';

import axios from 'axios';

// token should be read from state
const token = '123';

export function beginDeleteCandidate() {
  return {
    type: types.DELETE_CANDIDATE_BEGIN,
  };
}

export function deleteCandidateSuccess(roomId) {
  return {
    type: types.DELETE_CANDIDATE_SUCCESS,
    roomId
  };
}

export function deleteCandidateError(error) {
  return {
    type: types.DELETE_CANDIDATE_ERROR,
    error
  };
}

export function beginLoadAllCandidates() {
  return {
    type: types.LOAD_ALL_CANDIDATE_BEGIN
  };
}

export function loadAllCandidatesSuccess(rooms) {
  return {
    type: types.LOAD_ALL_CANDIDATE_SUCCESS,
    rooms
  };
}

export function loadAllCandidatesError(error) {
  return {
    type: types.LOAD_ALL_CANDIDATE_ERROR,
    error
  };
}

export function deleteCandidate(candidateId) {
  return dispatch => {
    dispatch(beginDeleteCandidate());
    return axios.delete('/candidate/' + candidateId + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteCandidateSuccess(candidateId));
        }
        else {
          dispatch(deleteCandidateError(response.data.error));
        }
      })
      .catch(error => dispatch(deleteCandidateError(error.response.data.error || error)));
  };
}

export function loadAllCandidates() {
  return dispatch => {
    dispatch(beginLoadAllCandidates());
    return axios.get('/candidate' + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidatesSuccess(response.data.rooms));
        }
        else {
          dispatch(loadAllCandidatesError(response.data.error));
        }
      })
      .catch(error => dispatch(loadAllCandidatesError(error.response.data.error || error)));
  };
}

