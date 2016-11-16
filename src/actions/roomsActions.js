import * as types from '../constants/actionTypes';
import axios from 'axios';
import {displayNotification} from './notificationActions';


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
  return (dispatch, getState) => {
    dispatch(beginDeleteRoom());
    const token = getState().user.token;
    return axios.delete('/room/' + roomId + '?token=' + token)
      .then(response => {
        if (response.status === 200) {
          dispatch(deleteRoomSuccess(roomId));
        }
        else {
          dispatch(displayNotification('error', '错误', toString(response.data.error)));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error.response.data.error || error))));
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
          dispatch(displayNotification(response.data.error));
        }
      })
      .catch(error => dispatch(displayNotification('error', '错误', toString(error.response.data.error || error))));
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
        dispatch(displayNotification('error', '错误', toString(err.response.data.error || err)));
      });
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
        dispatch(displayNotification('error', '错误', toString(error.response.data.error || error)));
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
        dispatch(displayNotification('error', '错误', toString(error)));
      });
  };
}
