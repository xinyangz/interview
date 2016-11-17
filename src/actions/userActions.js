import * as types from '../constants/actionTypes';
import { push } from 'react-router-redux';
import axios from 'axios';
import md5 from 'js-md5';
import {displayNotification} from './notificationActions';
import {loadAllRooms} from './roomsActions';
import {loadAllCandidates, loadTemplate} from './candidateManagerActions';

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

export function login(data, type) {
  return dispatch => {
    dispatch(beginLogin());
    const username = data.username;
    let password;
    if (type === 'hr') {
      password = md5(data.password);
    }
    else {
      password = data.password;
    }
    return axios.get('/user/login?username=' + username + '&password=' + password)
      .then(response => {
        if ( response.status === 200 ) {
          const {user} = response.data;
          const {type} = user;
          dispatch(loginSuccess(response.data));
          dispatch(displayNotification('success', '成功登录', '您已成功登录'));
          if (type === 'hr') {
            dispatch(push('/hr'));
            dispatch(loadAllRooms());
            dispatch(loadAllCandidates());
            dispatch(loadTemplate());
          }
          else if (type === 'interviewer') {
            dispatch(push('/interviewer'));
            dispatch(loadAllCandidates());
          }
          else {
            dispatch(push('/not-found'));
          }
        }
        else if (response.status === 400) {
          dispatch(loginError(response.data));
          dispatch(displayNotification('error', '错误', '用户名或密码错误'));
        }
        else {
          dispatch(loginError(response.data));
          dispatch(displayNotification('error', '错误', toString(response.data)));
        }
      })
      .catch(error=> {
        dispatch(loginError(error));
        return dispatch(displayNotification('error', '错误', '登录失败，请检查您的用户名和密码'));
      });
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
          dispatch(displayNotification('success', '退出成功', '感谢使用本系统'));
          dispatch(push('/'));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data)));
        }
      })
      .catch(error => {
        dispatch(displayNotification('error', '错误', toString(error)));
      });
  };
}

