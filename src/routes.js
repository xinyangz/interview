import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import FuelSavingsPage from './containers/FuelSavingsPage'; // eslint-disable-line import/no-named-as-default
import AboutPage from './components/AboutPage.js';
import NotFoundPage from './components/NotFoundPage.js';
import HRRoomTable from './components/HRRoomPage/HRRoomTable';
import InterviewerPage from './components/InterviewerPage/InterviewerPage';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RedirectPage from './components/RedirectPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

const routes = (store) => {
  const requireHR = (nextState, replace, callback) => {
    const {user} = store.getState();
    if (user == undefined || !user.isLogin || user.type !== 'hr') {
      replace({
        pathname: '/not-found',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    callback();
  };

  const requireInterviewer = (nextState, replace, callback) => {
    const {user} = store.getState();
    if (user == undefined || !user.isLogin || user.type !== 'interviewer') {
      replace({
        pathname: '/not-found',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    callback();
  };

  return (
    <Route path="/" component={App}>
      <IndexRoute component={WelcomePage}/>
      <Route path="hr" component={HRRoomTable} onEnter={requireHR} />
      <Route path="fuel-savings" component={FuelSavingsPage}/>
      <Route path="about" component={AboutPage} onEnter={requireHR}/>
      <Route path="interviewer" component={InterviewerPage} />
      <Route path="not-found" component={NotFoundPage} />
      <Route path="login" component={LoginPage} />
      <Route path="register" component={RegisterPage}/>
      <Route path="redirect" component={RedirectPage} />
      <Route path="*" component={NotFoundPage}/>
    </Route>
  );
};

export default routes;
