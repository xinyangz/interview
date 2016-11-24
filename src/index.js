/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import createRoutes from './routes';
import configureStore from './store/configureStore';
require('./favicon.ico'); // Tell webpack to load favicon.ico
import './styles/bootstrap-3.3.7-dist/css/bootstrap.css';
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import { syncHistoryWithStore } from 'react-router-redux';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:8000/api/v1';

const store = configureStore();

const routes = createRoutes(store);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>, document.getElementById('app')
);
