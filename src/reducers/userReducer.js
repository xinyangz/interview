import initialState from './initialState';
import * as types from '../constants/actionTypes';
import { combineReducers } from 'redux';

const message = (
  state = '',
  action
) => {
  switch(action.type) {
    case types.USER_LOGIN_SUCCESS:
    case types.USER_LOGIN:
      return '';
    default:
     return state;

  }
};

const userReducer = combineReducers({
    message
});

export default userReducer;
