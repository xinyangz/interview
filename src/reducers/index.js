import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import roomsStates from './roomsReducer';
import problemStates from './problemReducer';
import {routerReducer} from 'react-router-redux';
import registerReducer from './registerReducer'
import user from './userReducer';

const rootReducer = combineReducers({
  fuelSavings,
  roomsStates,
  problemStates,
  registerReducer,
  user,
  routing: routerReducer
});

export default rootReducer;
