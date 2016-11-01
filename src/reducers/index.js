import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import roomsStates from './roomsReducer';
import problemStates from './problemReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  fuelSavings,
  roomsStates,
  problemStates,
  routing: routerReducer
});

export default rootReducer;
