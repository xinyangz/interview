import React, {PropTypes} from 'react';
import Navigation from './NavigationBar';
import Notifications from 'react-notification-system-redux';
import {connect} from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navigation/>
        <Notifications notifications={this.props.notifications}/>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
}

export default connect(mapStateToProps)(App);
