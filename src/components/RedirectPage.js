import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {login} from '../actions/userActions';
import {push} from 'react-router-redux';

export class RedirectPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const query = this.props.location.query;
    const username = query.n;
    const password = query.p;
    if (username && password) {
      this.props.login({username, password});
    }
    else {
      this.props.push('/not-found');
    }
  }

  render() {
    return (
      <div>
        <p>
          跳转中...
        </p>
      </div>
    );
  }
}

RedirectPage.propTypes = {
  location: PropTypes.object,
  login: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired
};

export default connect(undefined, {login, push})(RedirectPage);
