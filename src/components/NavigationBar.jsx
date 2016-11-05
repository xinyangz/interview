import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import '../styles/navigation.css';


const Navigation = () => {
  return (
    <header className="navigation">
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">React Slingshot</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <IndexLinkContainer to="/">
            <NavItem eventKey={1}>Home</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/fuel-savings">
            <NavItem eventKey={2}>Fuel</NavItem>
          </LinkContainer>
          <LinkContainer to="/about">
            <NavItem eventKey={3}>About</NavItem>
          </LinkContainer>
          <LinkContainer to="/interviewer">
            <NavItem eventKey={4}>面试官房间</NavItem>
          </LinkContainer>
        </Nav>

        <Nav pullRight>
          <LinkContainer to="/login">
            <NavItem eventKey={5}>登录</NavItem>
          </LinkContainer>
          <LinkContainer to="/register">
            <NavItem eventKey={6}>注册</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar>
    </header>
  );
};

export default Navigation;
