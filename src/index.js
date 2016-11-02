/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import {loadAllRooms} from './actions/roomsActions';
import {loadAllCandidates} from './components/candidateManager/CandidateManagerActions'
require('./favicon.ico'); // Tell webpack to load favicon.ico
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import { syncHistoryWithStore } from 'react-router-redux';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3030/v1';

const store = configureStore();

store.dispatch(loadAllRooms());
store.dispatch(loadAllCandidates());

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>, document.getElementById('app')
);
