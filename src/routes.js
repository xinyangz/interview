import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import NotFoundPage from './components/NotFoundPage.js';
import InterviewerPage from './components/InterviewerPage/InterviewerPage';
import WelcomePage from './components/WelcomePage';
import HRManagerPage from './components/HRManagerPage';
import LoginPage from './components/LoginPage';
import RedirectPage from './components/RedirectPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

const routes = (store) => {
  const requireHR = (nextState, replace, callback) => {
    const {user} = store.getState();
    if (user === undefined || !user.isLogin) {
      replace({
        pathname: '/not-found',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    else if (user !== undefined && user.isLogin && user.type === 'interviewer') {
      replace({
        pathname: '/interviewer',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    callback();
  };

  const requireInterviewer = (nextState, replace, callback) => {
    const {user} = store.getState();
    if (user === undefined || !user.isLogin) {
      replace({
        pathname: '/not-found',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    else if (user !== undefined && user.isLogin && user.type === 'hr') {
      replace({
        pathname: '/hr',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    callback();
  };

  const redirectHome = (nextState, replace, callback) => {
    const {user} = store.getState();
    if (user !== undefined && user.isLogin && user.type === 'hr') {
      replace({
        pathname: '/hr',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    else if (user !== undefined && user.isLogin && user.type === 'interviewer') {
      replace({
        pathname: '/interviewer',
        state: {nextPathname: nextState.location.pathname}
      });
    }
    callback();
  };

  return (
    <Route path="/" component={App}>
      <IndexRoute component={WelcomePage} onEnter={redirectHome}/>
      <Route path="hr" component={HRManagerPage} onEnter={requireHR}/>
      <Route path="interviewer" component={InterviewerPage} onEnter={requireInterviewer} />
      <Route path="not-found" component={NotFoundPage} />
      <Route path="login" component={LoginPage}/>
      <Route path="register" component={RegisterPage}/>
      <Route path="redirect" component={RedirectPage} />
      <Route path="*" component={NotFoundPage}/>
    </Route>
  );
};

export default routes;
