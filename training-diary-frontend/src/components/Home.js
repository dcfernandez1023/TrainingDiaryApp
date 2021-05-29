import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';

const LOCAL_STORAGE = require('../util/localStorageHelper.js');


const Home = (props) => {

  const logout = () => {
    props.setIsLoggedIn(false);
    LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_USER", "");
    LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", "");
  }

  return (
    <Container fluid>
      <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
        <Navbar.Brand href="/"> Training Diary </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link> Activity </Nav.Link>
            <Nav.Link> Exercises </Nav.Link>
            <Nav.Link> Diet </Nav.Link>
            <Nav.Link> Body </Nav.Link>
            <Nav.Link> Custom </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="info" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br/>
      <Container>
      </Container>
    </Container>
  );
}

export default Home;
