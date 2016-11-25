import {createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {loadState, saveState} from './localStorage';
import throttle from 'lodash/throttle';

export default function configureStore() {
  const middewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunkMiddleware,
    routerMiddleware(browserHistory)
  ];

  const persistedState = loadState();

  const store = createStore(rootReducer, persistedState, compose(
    applyMiddleware(...middewares)
    )
  );

  store.subscribe(throttle(() => {
    saveState({
      user: store.getState().user,
      roomsStates: store.getState().roomsStates,
      problemStates: store.getState().problemStates,
      candidatesStates: store.getState().candidatesStates
    });
  }, 2000));

  return store;
}
