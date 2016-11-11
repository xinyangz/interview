import React, {PropTypes} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {connect} from 'react-redux';
import {logout} from '../actions/userActions';
import '../styles/navigation.css';


class NavigationBar extends React.Component {
  render() {
    let navRight;
    if (!this.props.isLogin) {
      navRight = (
        <Nav pullRight>
          <LinkContainer to="/login">
            <NavItem eventKey={5}>登录</NavItem>
          </LinkContainer>
          <LinkContainer to="/register">
            <NavItem eventKey={6}>注册</NavItem>
          </LinkContainer>
        </Nav>
      );
    }
    else {
      navRight = (
        <Nav pullRight>
          <NavItem>
            {this.props.info.username}
          </NavItem>
          <NavItem onClick={this.props.logout}>
            退出
          </NavItem>
        </Nav>
      );
    }

    return (
      <header className="navigation">
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">面试管理平台</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <IndexLinkContainer to="/hr">
              <NavItem eventKey={1}>房间管理</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/interviewer">
              <NavItem eventKey={3}>面试官管理台</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem eventKey={4}>About</NavItem>
            </LinkContainer>
          </Nav>

          {navRight}

        </Navbar>
      </header>
    );
  }
}

NavigationBar.propTypes = {
  isLogin: PropTypes.bool,
  type: PropTypes.string,
  info: PropTypes.object,
  logout: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isLogin: state.user.isLogin,
    type: state.user.type,
    info: state.user.info
  };
}

export default connect(mapStateToProps, {logout})(NavigationBar);
