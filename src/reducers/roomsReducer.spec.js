import {expect} from 'chai';
import reducer from './roomsReducer';
import * as types from '../constants/actionTypes';
import init from './initialState';

describe('Reducers: rooms', () => {
  const initialState = init.roomsStates;
  const rooms = [{
    "interviewer": "Jason Yip",
    "candidates": ["1", "2"],
    "name": "计蒜课秋招（前端）",
    "logo": "http://example.com/examplepage",
    "id": "1001",
    "problems": ["2001", "2002"]
  }, {
    "interviewer": "JY",
    "candidates": ["1"],
    "name": "计蒜课秋招",
    "logo": "http://example.com/examplepage",
    "id": "1002",
    "problems": ["2011"]
  }];
  it('should return initial state by default', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle LOAD_ALL_ROOMS', () => {
    expect(reducer(undefined, {type: types.LOAD_ALL_ROOMS}))
      .to.deep.equal({isWaiting: true, rooms: []});
  });

  it('should handle LOAD_ALL_ROOMS_SUCCESS', () => {
    expect(reducer(undefined, {type: types.LOAD_ALL_ROOMS_SUCCESS, rooms: rooms}))
      .to.deep.equal({isWaiting: false, rooms: rooms});
  });

  it('should handle DELETE_ROOM', () => {
    expect(reducer(undefined, {type: types.DELETE_ROOM}))
      .to.deep.equal({isWaiting: true, rooms: []});
  });

  it('should handle DELETE_ROOM_SUCCESS', () => {
    const expectedState = {
      isWaiting: false,
      rooms: [{
        "interviewer": "Jason Yip",
        "candidates": ["1", "2"],
        "name": "计蒜课秋招（前端）",
        "logo": "http://example.com/examplepage",
        "id": "1001",
        "problems": ["2001", "2002"]
      }]
    };
    expect(reducer({isWaiting: true, rooms}, {type: types.DELETE_ROOM_SUCCESS, roomId: "1002"}))
      .to.deep.equal(expectedState);
  });
});
