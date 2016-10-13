import * as types from '../constants/actionTypes';

export function deleteRoom(room_id) {
  return {
    type: types.DELETE_ROOM,
    room_id
  };
}
