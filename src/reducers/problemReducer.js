import initialState from './initialState';
import * as types from '../constants/actionTypes';
import {combineReducers} from 'redux';

const problems = (state = initialState.problemStates.problems, action) => {
  switch (action.type) {
    case types.LOAD_ALL_PROBLEMS_SUCCESS:
      return action.problems;
    default:
      return state;
  }
};

const isWaiting = (state = initialState.problemStates.isWaiting, action) => {
  switch (action.type) {
    case types.LOAD_ALL_PROBLEMS:
      return true;
    case types.LOAD_ALL_PROBLEMS_SUCCESS:
    case types.LOAD_ALL_PROBLEMS_ERROR:
      return false;
    default:
      return state;
  }
};

const problemReducer = combineReducers({
  problems,
  isWaiting
});

export default problemReducer;
