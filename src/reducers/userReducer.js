import initialState from './initialState';
import * as types from '../constants/actionTypes';
import {combineReducers} from 'redux';

const isLogin = (state = initialState.user.isLogin,
                 action) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
    case types.USER_LOGIN:
      return true;
    case types.USER_LOGIN_ERROR:
      return false;
    default:
      return state;
  }
};

const wrongPassword = (state = initialState.user.wrongPassword,
                       action) => {
  switch (action.type) {
    case types.USER_LOGIN_ERROR:
      if (action.error === 'wrong password')
        return true;
      else
        return false;
    default:
      return state;
  }
};

const token = (state = initialState.user.token,
                   action) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.token;
    default:
      return state;
  }
};

const type = (state = initialState.user.type,
                  action) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.user.type;
    default:
      return state;
  }
};

const info = (state = initialState.user.info,
                  action) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.user;
    default:
      return state;
  }
};

const userReducer = combineReducers({
  isLogin,
  token,
  type,
  wrongPassword,
  info
});

export default userReducer;
