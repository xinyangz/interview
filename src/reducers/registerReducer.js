/**
 * Created by 薛凯韬 on 2016/10/27.
 */
import * as types from '../constants/actionTypes';

export function RegisterReducer(state = {}, action) {
  switch (action.type) {
    case types.REGISTER_SUCCESS:
    case types.REGISTER_ERROR:
    default:
      return state;
  }
}

export default  RegisterReducer;
