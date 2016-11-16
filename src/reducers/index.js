import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import roomsStates from './roomsReducer';
import problemStates from './problemReducer';
import candidatesStates from './candidateManagerReducer';
import {routerReducer} from 'react-router-redux';
import registerReducer from './registerReducer';
import user from './userReducer';
import {reducer as notifications} from 'react-notification-system-redux';

const rootReducer = combineReducers({
  fuelSavings,
  roomsStates,
  problemStates,
  registerReducer,
  candidatesStates,
  user,
  routing: routerReducer,
  notifications
});

export default rootReducer;
