import initialState from './initialState';
import * as types from '../constants/actionTypes';
import {combineReducers} from 'redux';

const candidates = (state = initialState.candidatesStates.candidates, action) => {
  switch (action.type) {
    case types.DELETE_CANDIDATE_SUCCESS:
      return state.filter(candidate => candidate.id != action.candidateId);
    case types.LOAD_ALL_CANDIDATE_SUCCESS:
      return action.candidates;
    default:
      return state;
  }
};

const isWaiting = (state = initialState.candidatesStates.isWaiting, action) => {
  switch (action.type) {
    case types.LOAD_ALL_CANDIDATE_BEGIN:
    case types.DELETE_CANDIDATE_BEGIN:
    case types.ADD_CANDIDATE_BEGIN:
    case types.EDIT_CANDIDATE_BEGIN:
    case types.LIST_CANDIDATE_BEGIN:
      return true;
    case types.DELETE_CANDIDATE_SUCCESS:
    case types.DELETE_CANDIDATE_ERROR:
    case types.LOAD_ALL_CANDIDATE_SUCCESS:
    case types.LOAD_ALL_CANDIDATE_ERROR:
    case types.ADD_CANDIDATE_SUCCESS:
    case types.ADD_CANDIDATE_ERROR:
    case types.LIST_CANDIDATE_SUCCESS:
    case types.LIST_CANDIDATE_ERROR:
      return false;
    default:
      return state;
  }
};

const templateUrl = (state = initialState.candidatesStates.templateUrl, action) => {
  switch (action.type) {
    case types.LOAD_TEMPLATE_SUCCESS:
      return {csv: action.csv, xlsx: action.xlsx};
    default:
      return state;
  }
};

const candidatesManagerReducer = combineReducers({
  candidates,
  isWaiting,
  templateUrl
});

export default candidatesManagerReducer;
