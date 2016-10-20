import * as types from '../constants/actionTypes';

import axios from 'axios';

export function deleteRoomSuccess(room_id) {
  return {
    type: types.DELETE_ROOM_SUCCESS,
    room_id
  };
}

export function deleteRoomError() {
  alert('删除房间错误');
}

export function loadAllRoomsSuccess(data) {
  return {
    type: types.LOAD_ALL_ROOM_SUCCESS,
    rooms: data.rooms
  };
}

export function loadAllRoomsError(error) {
  alert('读取房间列表错误' + error);
}

export function deleteRoom(room_id) {
  return dispatch => {
    axios.delete('/room/' + room_id + '?token=123')
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteRoomSuccess(room_id));
        }
        else {
          dispatch(deleteRoomError());
        }
      })
      .catch(error => alert(error));
  };
}

export function loadAllRooms() {
  return dispatch => {
    axios.get('/room?token=123')
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllRoomsSuccess(response.data));
        }
        else {
          dispatch(loadAllRoomsError(response.data));
        }
      })
      .catch(error => alert(error));
  };
}

