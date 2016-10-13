import initialState from './initialState';
import {DELETE_ROOM} from '../constants/actionTypes';

export default function roomsReducer(state = initialState.rooms, action) {
  switch (action.type) {
    case DELETE_ROOM:
      return state.filter(room => room.id != action.room_id);
    default:
      return state;
  }
}
