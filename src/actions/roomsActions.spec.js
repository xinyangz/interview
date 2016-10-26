import * as actions from './roomsActions';
import {expect} from 'chai';
import * as types from '../constants/actionTypes';
import init from '../reducers/initialState';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import thunk from 'redux-thunk';
import sinon from 'sinon';


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Rooms async actions', () => {
  let sandbox;

  const initialState = init.roomsStates;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Load all rooms', (done) => {
    const response = {
      status: 200,
      data: {
        rooms: [{
          "interviewer": "Jason Yip",
          "candidates": ["1", "2"],
          "name": "计蒜课秋招（前端）",
          "logo": "http://example.com/examplepage",
          "id": "1001",
          "problems": ["2001", "2002"]
        }]
      }
    };

    const errorMsg = {
      response: {
        status: 400,
        data: {
          error: "something went wrong"
        }
      }
    };

    it('should dispatch LOAD_ALL_ROOMS_SUCCESS when server returns status 200', () => {
      const expectedActions = [
        {
          type: types.LOAD_ALL_ROOMS
        },
        {
          type: types.LOAD_ALL_ROOMS_SUCCESS,
          rooms: response.data.rooms
        }
      ];

      sandbox.stub(axios, 'get').returns(Promise.resolve(response));

      const store = mockStore(initialState);
      store.dispatch(actions.loadAllRooms())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });

    it('should dispatch LOAD_ALL_ROOMS_ERROR when server call fails', () => {
      const expectedActions = [
        {
          type: types.LOAD_ALL_ROOMS
        },
        {
          type: types.LOAD_ALL_ROOMS_ERROR,
          error: errorMsg.response.data.error
        }
      ];

      const store = mockStore(initialState);
      sandbox.stub(axios, 'get').returns(Promise.reject(errorMsg));
      store.dispatch(actions.loadAllRooms())
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Delete room', (done) => {
    const response = {
      status: 200,
      data: {
        "interviewer" : "aeiou",
        "candidates" : [ "aeiou" ],
        "name" : "计蒜课秋招（前端）",
        "logo" : "http://example.com/examplepage",
        "id" : "1001",
        "problems" : [ "aeiou" ]
      }
    };

    const errorMsg = {
      response: {
        status: 400,
        data: {
          status: 30,
          error: "Something went wrong"
        }
      }
    };

    it('should dispatch DELETE_ROOM_SUCCESS when server returns status 200', () => {
      const expectedActions = [
        {
          type: types.DELETE_ROOM
        },
        {
          type: types.DELETE_ROOM_SUCCESS,
          roomId: response.data.id
        }
      ];

      const store = mockStore(initialState);
      sandbox.stub(axios, 'delete').returns(Promise.resolve(response));
      store.dispatch(actions.deleteRoom(response.data.id))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });

    it('should dispatch DELETE_ROOM_ERROR when server return status is not 200', () => {
      const expectedActions = [
        {
          type: types.DELETE_ROOM
        },
        {
          type: types.DELETE_ROOM_ERROR,
          error: errorMsg.response.data.error
        }
      ];
      const store = mockStore(initialState);
      sandbox.stub(axios, 'delete').returns(Promise.reject(errorMsg));
      store.dispatch(actions.deleteRoom(response.data.id))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });
  });
});
