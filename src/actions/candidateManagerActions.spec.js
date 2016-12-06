import * as actions from './candidateManagerActions';
import {expect} from 'chai';
import * as types from '../constants/actionTypes';
import init from '../reducers/initialState';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import thunk from 'redux-thunk';
import sinon from 'sinon';

// TODO: rewrite test

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Candidates async actions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Load all candidates', (done) => {
    const response = {
      status: 200,
      data: {
        rooms: [{
          "name": "Jason Yip",
          "email": "bibi@163.com",
          "phone": "1213123123",
          "status": "not",
          "id": "1001",
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

    it('should dispatch LOAD_ALL_CANDIDATE_SUCCESS when server returns status 200', () => {
      const expectedActions = [
        {
          type: types.LOAD_ALL_CANDIDATE_BEGIN
        },
        {
          type: types.LOAD_ALL_CANDIDATE_SUCCESS,
          rooms: response.data.rooms
        }
      ];

      sandbox.stub(axios, 'get').returns(Promise.resolve(response));

      const store = mockStore(init);
      store.dispatch(actions.loadAllCandidates())
        .then(() => {
          //expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });

    it('should dispatch LOAD_ALL_CANDIDATES_ERROR when server call fails', () => {
      const expectedActions = [
        {
          type: types.LOAD_ALL_CANDIDATE_BEGIN,
        },
        {
          type: types.LOAD_ALL_CANDIDATE_ERROR,
          error: errorMsg.response.data.error
        }
      ];

      const store = mockStore(init);
      sandbox.stub(axios, 'get').returns(Promise.reject(errorMsg));
      store.dispatch(actions.loadAllCandidates())
        .then(() => {
          //expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Delete candidate', (done) => {
    const response = {
      status: 200,
      data: {
        "name" : "aeiou",
        "email" : "123123@123.com",
        "phone" : "3245345345",
        "id" : "1001",
        "status": "not",
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

    it('should dispatch DELETE_CANDIDATE_SUCCESS when server returns status 200', () => {
      const expectedActions = [
        {
          type: types.DELETE_CANDIDATE_BEGIN
        },
        {
          type: types.DELETE_CANDIDATE_SUCCESS,
          roomId: response.data.id
        }
      ];

      const store = mockStore(init);
      sandbox.stub(axios, 'delete').returns(Promise.resolve(response));
    });

    it('should dispatch DELETE_CANDIDATE_ERROR when server return status is not 200', () => {
      const expectedActions = [
        {
          type: types.DELETE_CANDIDATE_BEGIN
        },
        {
          type: types.DELETE_CANDIDATE_ERROR,
          error: errorMsg.response.data.error
        }
      ];
      const store = mockStore(init);
      sandbox.stub(axios, 'delete').returns(Promise.reject(errorMsg));
      store.dispatch(actions.deleteCandidate(response.data.id))
        .then(() => {
          //expect(store.getActions()).to.deep.equal(expectedActions);
        })
        .then(done)
        .catch(done);
    });
  });
});
