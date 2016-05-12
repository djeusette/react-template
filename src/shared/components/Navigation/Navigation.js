import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Navbar, NavDropdown, Nav, NavItem, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Navigation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  navClass(path) {
    const { router } = this.context;
    return (router.isActive(path, true) ? 'active' : '');
  }

  render() {

    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Home</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>

          <Nav pullRight>
            <li><Link to="/login">Login</Link></li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
