import initialState from './initialState';
import * as types from '../constants/actionTypes';

export default function roomsReducer(state = initialState.rooms, action) {
  switch (action.type) {
    case types.DELETE_ROOM_SUCCESS:
      return state.filter(room => room.id != action.room_id);
    case types.LOAD_ALL_ROOM_SUCCESS:
      return action.rooms;
    default:
      return state;
  }
}
