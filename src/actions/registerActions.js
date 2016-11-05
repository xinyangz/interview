import * as types from '../constants/actionTypes'
import { push } from 'react-router-redux';
import axios from 'axios';

export function registerBegin() {
  return {
    type : types.REGISTER_BEGIN,
  }
}

export function registerSuccess(message) {
  return {
    type : types.REGISTER_SUCCESS,
    message
  }
}

export function registerError(message) {
  return {
    type : types.REGISTER_ERROR,
    message
  }
}

export function register(registerInfo) {
  return dispatch => {
    dispatch(registerBegin());

    return axios.post('/user/register', registerInfo)
      .then(response => {
        if (response.status === 200) {
          dispatch(registerSuccess(response.data));
          dispatch(push('/login'));
        } else {
          dispatch(registerError('Oops! Something went wrong!'));
        }
      })
      .catch(err => {
        dispatch(registerError(err));
      });
  };
}
