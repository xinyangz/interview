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

export function beginAddRoom() {
  return {
    type: types.ADD_ROOM
  };
}

export function addRoomSuccess(room) {
  return {
    type: types.ADD_ROOM_SUCCESS,
    room
  };
}

export function addRoomError(error) {
  return {
    type: types.ADD_ROOM_ERROR,
    error
  };
}

export function beginModifyRoom() {
  return {
    type: types.MODIFY_ROOM
  };
}

export function modifyRoomSuccess(room) {
  return {
    type: types.MODIFY_ROOM_SUCCESS,
    room
  };
}

export function modifyRoomError(error) {
  return {
    type: types.MODIFY_ROOM_ERROR,
    error
  };
}

export function beginUploadImage() {
  return {
    type: types.UPLOAD_IMAGE
  };
}

export function uploadImageSuccess() {
  return {
    type: types.UPLOAD_IMAGE_SUCCESS
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
  return (dispatch, getState) => {
    dispatch(beginModifyRoom());
    const room_id = data.room_id;
    const room = data.newRoom;
    const image = new FormData();
    image.append('logo', data.logo);
    const token = getState().user.token;
    return axios.put('/room/' + room_id +'?token=' + token, room)
      .then(response => {
        if(response.status === 200) {
          dispatch(modifyRoomSuccess(response.data.room));
          dispatch(beginUploadImage());
          return axios.put('/room/' + room_id + '/logo' + '?token=' + token, image);
        }
        else {
          throw (response.data);
        }
      })
      .then(response => {
        if(response.status === 200) {
          dispatch(uploadImageSuccess());
        }
        else {
          throw (response.data);
        }
      })
      .catch(error => {
        dispatch(modifyRoomError(error));
        dispatch(uploadImageError(error));
      });
  };
}

export function addRoom(data) {
  return (dispatch, getState) => {
    dispatch(beginAddRoom());
    const room = data.newRoom;
    const image = new FormData();
    image.append('logo', data.logo);
    const token = getState().user.token;
    return axios.post('/room' + '?token=' + token, room)
      .then(response => {
        if(response.status === 200) {
          dispatch(addRoomSuccess(response.data.room));
          const roomNum = getState().roomsStates.rooms.length;
          const room_id = getState().roomsStates.rooms[roomNum - 1].id;
          dispatch(beginUploadImage());
          return axios.put('/room/' + room_id + '/logo' + '?token=' + token, image);
        }
        else {
          throw (response.data);
        }
      })
      .then(response => {
        if(response.status === 200) {
          dispatch(uploadImageSuccess());
        }
        else {
          throw (response.data);
        }
      })
      .catch(error => {
        dispatch(addRoomError(error));
        dispatch(uploadImageError(error));
      });
  };
}
