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

export function login(data) {
  return dispatch => {
    dispatch(beginLogin());
    const username = data.username;
    const password = data.password;
    axios.get('/user/login?username=' + username + '&password=' + password)
      .then(response => {
        if ( response.status === 200 ) {
          dispatch(loginSuccess(response.data));
          dispatch(push('/'));
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

