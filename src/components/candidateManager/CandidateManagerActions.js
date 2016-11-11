import * as types from './Consts';

import axios from 'axios';

// token should be read from state
const token = '123';
const offset = '0';
const limit = '1';

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
      .catch(error => dispatch(deleteCandidateError(error)));
  };
}

export function editCandidate(candidate) {
  return dispatch => {
    dispatch(beginEditCandidate());
    return axios.put('/candidate/' + candidate.id + '?token=' + token, candidate)
      .then(response => {
        if (response.status === 200) {
          dispatch(editCandidateSuccess(candidate.id));
          dispatch(loadAllCandidates());
        }
        else {
          dispatch(editCandidateError(response.data.error));
        }
      })
      .catch(error => dispatch(editCandidateError(error)));
  };
}

export function addCandidate(candidate) {
  console.log(candidate);
  return dispatch => {
    dispatch(addCandidateBegin());
    return axios.post('/candidate?token=' + token, candidate)
      .then(response => {
        if (response.status === 200) {
          dispatch(addCandidateSuccess(candidate));
          dispatch(loadAllCandidates());
        }
        else {
          dispatch(addCandidateError(response.data.error));
        }
      })
      .catch(error => dispatch(addCandidateError(error)));
  };
}

export function loadAllCandidates() {
  return dispatch => {
    dispatch(beginLoadAllCandidates());
    return axios.get('/candidate' + '?offset='+ offset + '&limit=' + limit + '&token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllCandidatesSuccess(response.data.candidates));
        }
        else {
          dispatch(loadAllCandidatesError(response.data.error));
        }
      })
      .catch(error => dispatch(loadAllCandidatesError(error)));
  };
}

