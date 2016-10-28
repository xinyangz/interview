import * as types from '../constants/actionTypes';
import { push } from 'react-router-redux';
import axios from 'axios';


// import { polyfill } from 'es6-promise';
// require('es6-promise').polyfill();


export function beginLogin() {
  return {
    type: types.USER_LOGIN
  };
}

export function loginSuccess(data) {
  debugger;
  return {
    type: types.USER_LOGIN_SUCCESS,
    user: data.user,
    token: data.token
  };
}

export function loginError() {
  alert('登陆失败');
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
          console.log('response correct');
        }
        else {
          dispatch(loginError());
        }
      })
      .catch(err => alert(err));
  };
}

