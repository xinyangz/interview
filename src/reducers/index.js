import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import rooms from './roomsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  fuelSavings,
  rooms,
  routing: routerReducer
});

export default rootReducer;
