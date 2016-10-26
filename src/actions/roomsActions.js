import * as types from '../constants/actionTypes';

import axios from 'axios';

// token should be read from state
const token = '123';

export function beginDeleteRoom() {
  return {
    type: types.DELETE_ROOM
  };
}

export function deleteRoomSuccess(room_id) {
  return {
    type: types.DELETE_ROOM_SUCCESS,
    room_id
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

export function deleteRoom(room_id) {
  return dispatch => {
    dispatch(beginDeleteRoom());
    axios.delete('/room/' + room_id + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteRoomSuccess(room_id));
        }
        else {
          dispatch(deleteRoomError(response.data));
        }
      })
      .catch(error => dispatch(deleteRoomError(error)));
  };
}

export function loadAllRooms() {
  return dispatch => {
    dispatch(beginLoadAllRooms());
    axios.get('/room' + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(loadAllRoomsSuccess(response.data.rooms));
        }
        else {
          dispatch(loadAllRoomsError(response.data));
        }
      })
      .catch(error => dispatch(loadAllRoomsError(error)));
  };
}

