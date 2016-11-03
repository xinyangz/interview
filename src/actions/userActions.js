import * as types from '../constants/actionTypes';
import { push } from 'react-router-redux';
import axios from 'axios';


export function beginLogin() {
  return {
    type: types.USER_LOGIN
  };
}

export function loginSuccess(data) {
  return {
    type: types.USER_LOGIN_SUCCESS,
    user: data.user,
    token: data.token
  };
}

export function loginError(error) {
  return {
    type: types.USER_LOGIN_ERROR,
    error
  };
}

export function logoutSuccess() {
  return {
    type: types.USER_LOGOUT_SUCCESS
  };
}

export function logoutError(error) {
  return {
    type: types.USER_LOGOUT_ERROR,
    error
  };
}

export function login(data) {
  return dispatch => {
    dispatch(beginLogin());
    const username = data.username;
    const password = data.password;
    return axios.get('/user/login?username=' + username + '&password=' + password)
      .then(response => {
        if ( response.status === 200 ) {
          dispatch(loginSuccess(response.data));
          dispatch(push('/hr'));
        }
        else if (response.status === 400) {
          dispatch(loginError('wrong password'));
        }
        else {
          dispatch(loginError(response.data));
        }
      })
      .catch(error=>dispatch(loginError(error)));
  };
}

export function logout() {
  return (dispatch, getState) => {
    const {token} = getState().user;
    return axios.get('/user/logout', {
      params: {
        token
      }
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(logoutSuccess());
          dispatch(push('/'));
        }
        else {
          dispatch(logoutError(response.data));
        }
      })
      .catch(error => {
        dispatch(logoutError(error));
      });
  };
}

