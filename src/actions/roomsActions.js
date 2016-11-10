import * as types from '../constants/actionTypes';
import axios from 'axios';

// token should be read from state
const token = '123';

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

export function beginModifyRoom() {
  return {
    type: types.MODIFY_ROOM
  };
}

export function modifyRoomSuccess(data) {
  return {
    type: types.MODIFY_ROOM_SUCCESS,
    room: data
  };
}

export function modifyRoomError(error) {
  return {
    type: types.MODIFY_ROOM_ERROR,
    error
  };
}

export function uploadImage() {
  return {
    type: types.UPLOAD_IMAGE
  };
}

export function uploadImageSuccess(file) {
  return {
    type: types.UPLOAD_IMAGE_SUCCESS,
    image: file
  };
}

export function uploadImageError(error) {
  return {
    type: types.UPLOAD_IMAGE_ERROR,
    error
  };
}

export function deleteRoom(roomId) {
  return dispatch => {
    dispatch(beginDeleteRoom());
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
  return dispatch => {
    dispatch(beginLoadAllRooms());
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

export function modifyRoom(data) {
  return (dispatch, getState)  => {
    dispatch(beginModifyRoom());
    const room_id = data.room_id;
    const room = data.newRoom;
    const formData = new FormData();
    formData.append('image', data.logo);

    //console.log('getState is:');
    //console.log(getState());
    //调用实时token而非固定的token
    return axios.put('/room/' + room_id + '?token=' + token, {room, formData})
      .then(response => {
        if(response.status === 200) {
          //console.log("response status 200");
          //console.log(response.data);
          dispatch(modifyRoomSuccess(response.data));
        }
        else {
          dispatch(modifyRoomError(response.data.error));
        }
      })
      .catch(error => dispatch(modifyRoomError(error.response.data.error || error)));
  };
}

