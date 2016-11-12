import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import roomsStates from './roomsReducer';
import problemStates from './problemReducer';
import candidatesStates from './candidateManagerReducer'
import {routerReducer} from 'react-router-redux';
import user from './userReducer';

const rootReducer = combineReducers({
  fuelSavings,
  roomsStates,
  problemStates,
  candidatesStates,
  user,
  routing: routerReducer
});

export default rootReducer;
