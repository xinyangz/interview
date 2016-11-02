import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import roomsStates from './roomsReducer';
import problemStates from './problemReducer';
import {routerReducer} from 'react-router-redux';
import RegisterReducer from '../components/registerpage/RegisterReducers'
import user from './userReducer';

const rootReducer = combineReducers({
  fuelSavings,
  roomsStates,
  problemStates,
  RegisterReducer,
  user,
  routing: routerReducer
});

export default rootReducer;
