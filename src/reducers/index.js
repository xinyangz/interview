import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import rooms from './roomsReducer';
import {routerReducer} from 'react-router-redux';
import user from './userReducer';

const rootReducer = combineReducers({
  fuelSavings,
  rooms,
  user,
  routing: routerReducer
});

export default rootReducer;
