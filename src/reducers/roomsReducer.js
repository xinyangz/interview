import initialState from './initialState';
import * as types from '../constants/actionTypes';
import {combineReducers} from 'redux';

const rooms = (state = initialState.roomsStates.rooms, action) => {
  function isChangedRoom(room) {
    return room.id === action.room_id;
  }
  switch (action.type) {
    case types.DELETE_ROOM_SUCCESS:
      return state.filter(room => room.id != action.roomId);
    case types.LOAD_ALL_ROOMS_SUCCESS:
      return action.rooms;
    case types.MODIFY_ROOM_SUCCESS:
     {
       state.find(isChangedRoom).name = action.room.name;
       return state;
     }
    default:
      return state;
  }
};

const isWaiting = (state = initialState.roomsStates.isWaiting, action) => {
  switch (action.type) {
    case types.LOAD_ALL_ROOMS:
    case types.DELETE_ROOM:
    case types.MODIFY_ROOM:
      return true;
    case types.DELETE_ROOM_SUCCESS:
    case types.DELETE_ROOM_ERROR:
    case types.LOAD_ALL_ROOMS_SUCCESS:
    case types.LOAD_ALL_ROOMS_ERROR:
    case types.MODIFY_ROOM_SUCCESS:
    case types.MODIFY_ROOM_ERROR:
      return false;
    default:
      return state;
  }
};

const roomsReducer = combineReducers({
  rooms,
  isWaiting
});

export default roomsReducer;
