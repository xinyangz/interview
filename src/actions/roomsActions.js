import * as types from '../constants/actionTypes';

import axios from 'axios';


export function beginDeleteRoom() {
  return {
    type: types.DELETE_ROOM
  };
}

export function deleteRoomSuccess(roomId) {
  return {
    type: types.DELETE_ROOM_SUCCESS,
    roomId
  };
}

export function deleteRoomError(error) {
  return {
    type: types.DELETE_ROOM_ERROR,
    error
  };
}

export function beginLoadAllRooms() {
  return {
    type: types.LOAD_ALL_ROOMS
  };
}

export function loadAllRoomsSuccess(rooms) {
  return {
    type: types.LOAD_ALL_ROOMS_SUCCESS,
    rooms
  };
}

export function loadAllRoomsError(error) {
  return {
    type: types.LOAD_ALL_ROOMS_ERROR,
    error
  };
}

export function loadRoomSuccess(room) {
  return {
    type: types.LOAD_ROOM_SUCCESS,
    room
  };
}

export function loadRoomError(error) {
  return {
    type: types.LOAD_ROOM_ERROR,
    error
  };
}

export function beginLoadRoom() {
  return {
    type: types.LOAD_ROOM
  };
}

export function deleteRoom(roomId) {
  return (dispatch, getState) => {
    dispatch(beginDeleteRoom());
    const token = getState().user.token;
    return axios.delete('/room/' + roomId + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteRoomSuccess(roomId));
        }
        else {
          dispatch(deleteRoomError(response.data.error));
        }
      })
      .catch(error => dispatch(deleteRoomError(error.response.data.error || error)));
  };
}

export function loadAllRooms() {
  return (dispatch, getState) => {
    dispatch(beginLoadAllRooms());
    const token = getState().user.token;
    return axios.get('/room' + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllRoomsSuccess(response.data.rooms));
        }
        else {
          dispatch(loadAllRoomsError(response.data.error));
        }
      })
      .catch(error => dispatch(loadAllRoomsError(error.response.data.error || error)));
  };
}

export function loadInterviewerRoom() {
  return (dispatch, getState) => {
    const token = getState().user.token;
    // get roomId by token
    return axios.get('/interviewer' + '?token=' + token)
      .then(res => {
        if (res.status === 200) {
          // get room info by roomId
          const roomId = res.data.roomId;
          return axios.get('/room/' + roomId + '?token=' + token);
        }
        else if (res.status === 400) {
          throw '获取房间信息失败';
        }
        else {
          throw res.data;
        }
      })
      .then(res => {
        if (res.status === 200) {
          dispatch(loadRoomSuccess(res.data));
        }
        else if (res.status === 403) {
          throw '用户无访问权限';
        }
        else if (res.status === 404) {
          throw '房间不存在';
        }
        else {
          throw res.data;
        }
      })
      .catch(err => {
        dispatch(loadRoomError(err));
      });
  }
}

