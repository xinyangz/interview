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
        </Nav>

        <Nav pullRight>
          <NavItem eventKey={4}>登陆</NavItem>
          <NavItem eventKey={5}>注册</NavItem>
        </Nav>
      </Navbar>
    </header>
  );
};

export default Navigation;
