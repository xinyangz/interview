import initialState from './initialState';
import * as types from '../constants/actionTypes';
import { combineReducers } from 'redux';

const isLogin = (
  state = initialState.isLogin,
  action
) => {
  switch(action.type) {
    case types.USER_LOGIN_SUCCESS:
    case types.USER_LOGIN:
      return true;
    case types.USER_LOGIN_ERROR:
      return false;
    default:
      return state;
  }
};

const userToken = (
  state = initialState.userToken,
  action
) => {
  switch(action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.token;
    default:
      return state;
  }
};

const userType = (
  state = initialState.userType,
  action
) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.user.type;
    default:
      return state;
  }
};

const userInfo = (
  state = initialState.userInfo,
    action
) => {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return action.user;
    default:
      return state;
  }
};

const userReducer = combineReducers({
  isLogin,
  userToken,
  userType,
  userInfo
});

export default userReducer;
