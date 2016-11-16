import {expect} from 'chai';
import reducer from './candidateManagerReducer';
import * as types from '../constants/actionTypes';
import init from './initialState';

describe('Reducers: candidates', () => {
  const initialState = init.candidatesStates;
  const candidates = [{
      "name": "Jason Yip",
      "email": "bibi@163.com",
      "phone": "1213123123",
      "id": "1001",
  },
    {
    "name": "JY",
    "email": "131213@123.com",
    "phone": "123123123123123",
    "id": "1002",
  }];
  it('should return initial state by default', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle LOAD_ALL_CANDIDATES', () => {
    expect(reducer(undefined, {type: types.LOAD_ALL_CANDIDATE_BEGIN}))
      .to.deep.equal({isWaiting: true, candidates: [], templateUrl: {}});
  });

  it('should handle LOAD_ALL_ROOMS_SUCCESS', () => {
    expect(reducer(undefined, {type: types.LOAD_ALL_CANDIDATE_SUCCESS, candidates: candidates}))
      .to.deep.equal({isWaiting: false, candidates: candidates, templateUrl: {}});
  });

  it('should handle DELETE_CANDIDATE', () => {
    expect(reducer(undefined, {type: types.DELETE_CANDIDATE_BEGIN}))
      .to.deep.equal({isWaiting: true, candidates: [], templateUrl: {}});
  });

  it('should handle DELETE_CANDIDATE_SUCCESS', () => {
    const expectedState = {
      isWaiting: false,
      candidates: [{
      "name": "Jason Yip",
      "email": "bibi@163.com",
      "phone": "1213123123",
      "id": "1001",
    }],
      templateUrl: {}
    };
    expect(reducer({isWaiting: true, candidates}, {type: types.DELETE_CANDIDATE_SUCCESS, candidateId: "1002"}))
      .to.deep.equal(expectedState);
  });
});
