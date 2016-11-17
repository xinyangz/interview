import * as types from '../constants/actionTypes';
import { push } from 'react-router-redux';
import axios from 'axios';
import {displayNotification} from './notificationActions';

export function registerBegin() {
  return {
    type : types.REGISTER_BEGIN,
  };
}

export function registerSuccess(message) {
  return {
    type : types.REGISTER_SUCCESS,
    message
  };
}

export function registerError(message) {
  return {
    type : types.REGISTER_ERROR,
    message
  };
}

export function register(registerInfo) {
  return dispatch => {
    dispatch(registerBegin());

    return axios.post('/user/register', registerInfo)
      .then(response => {
        if (response.status === 200) {
          dispatch(registerSuccess(response.data));
          dispatch(displayNotification('success', '注册成功', '账户已创建，请您登录'));
          dispatch(push('/login'));
        } else {
          dispatch(displayNotification('error', '错误', '注册出错'));
        }
      })
      .catch(err => {
        dispatch(displayNotification('error', '错误', '注册失败，您的用户名可能已被使用或是其他原因'));
      });
  };
}
