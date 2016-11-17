import {createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';

export default function configureStore(initialState) {
  const middewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunkMiddleware,
    routerMiddleware(browserHistory)
  ];

  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middewares)
    )
  );
}
