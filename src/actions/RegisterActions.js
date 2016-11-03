/**
 * Created by 薛凯韬 on 2016/10/27.
 */
import * as types from '../constants/actionTypes'
import { push } from 'react-router-redux';
import axios from 'axios';

export function beginRegister() {
  return {
    type : types.BEGIN_REGISTER
  }
}

export function successRegister(message) {
  return {
    type : types.REGISTER_SUCCESS,
    message
  }
}

export function errorRegister(message) {
  return {
    type : types.REGISTER_ERROR,
    message
  }
}

export function Register(registerInfo) {
  return dispatch => {
    dispatch(beginRegister());

    return axios.post('/user/register', registerInfo)
      .then(response => {
        if (response.status === 200) {
          dispatch(successRegister(response.data));
          dispatch(push('/login'));
        } else {
          dispatch(errorRegister('Oops! Something went wrong!'));
        }
      })
      .catch(err => {
        dispatch(errorRegister(err));
      });
  };
}
