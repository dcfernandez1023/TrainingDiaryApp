import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Navbar, Nav, Button, Spinner } from 'react-bootstrap';

import Activity from './activity/Activity.js';
import Body from './body/Body.js';
import Custom from './custom/Custom.js';
import Diet from './diet/Diet.js';
import Exercise from './exercises/Exercise.js';

import '../styles/home.css';

const LOCAL_STORAGE = require('../util/localStorageHelper.js');


const Home = (props) => {
  const TAB_COMPONENTS = [
    <Activity />,
    <Exercise />,
    <Diet />,
    <Body />,
    <Custom />
  ];

  const [currentTab, setCurrentTab] = useState();

  useEffect(() => {
    getLastTab();
  }, []);

  const getLastTab = () => {
    var last = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_TAB");
    if(last === null || last === undefined) {
      setCurrentTab(0);
    }
    else {
      var parsed = parseInt(last);
      if(!isNaN(parsed) && parsed >= 0 && parsed <= TAB_COMPONENTS.length - 1) {
        setCurrentTab(parsed);
      }
      else {
        setCurrentTab(0);
      }
    }
  }

  const setLastTab = (eventKey) => {
    setCurrentTab(eventKey);
    LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_TAB", eventKey);
  }

  const logout = () => {
    props.setIsLoggedIn(false);
    LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_USER", "");
    LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", "");
  }

  if(currentTab === undefined) {
    return (
      <div className="spinner-align">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Container fluid>
      <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
        <Navbar.Brand href="/"> Training Diary </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav defaultActiveKey = {currentTab} className = "mr-auto"
          onSelect = {(eventKey) => {setLastTab(eventKey)}}
        >
            <Nav.Link eventKey = {0}> Activity </Nav.Link>
            <Nav.Link eventKey = {1}> Exercise </Nav.Link>
            <Nav.Link eventKey = {2}> Diet </Nav.Link>
            <Nav.Link eventKey = {3}> Body </Nav.Link>
            <Nav.Link eventKey = {4}> Custom </Nav.Link>
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
        {TAB_COMPONENTS[currentTab]}
      </Container>
    </Container>
  );
}

export default Home;
