import React, { useState, useEffect } from 'react';

import { Jumbotron, Container, Alert, Row, Col, Button, Card, Tabs, Tab, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import '../../styles/login.css';

const USER = require('../../models/user.js');
const AUTH = require('../../controllers/auth.js');
const LOCAL_STORAGE = require('../../util/localStorageHelper.js');


const Login = (props) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [newUser, setNewUser] = useState({});
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [loginValidated, setLoginValidated] = useState(false);
  const [registerValidated, setRegisterValidated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setNewUser(Object.assign({}, USER.user));
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoginValidated(true);
    if(loginEmail.trim().length === 0 || loginPassword.trim().length === 0) {
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        props.setIsLoggedIn(true);
        LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", res.data.data.token);
        LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_USER", res.data.data.user_id);
      }
    };
    const callbackOnError = (error) => {
      setIsError(true);
      setErrorMsg(error.response.data.message);
    }
    AUTH.login(loginEmail, loginPassword, callback, callbackOnError);
  }

  const handleRegister = (event) => {
    event.preventDefault();
    setRegisterValidated(true);
    for(var i = 0; i < USER.displayFields.length; i++) {
      var key = USER.displayFields[i].value;
      if(key === "birthday" && birthday === null) {
        return;
      }
      if(newUser[key].trim().length === 0 && key !== "birthday") {
        return;
      }
    }
    if(registerPassword.trim().length === 0 || passwordConfirm.trim().length === 0) {
      return;
    }
    if(registerPassword !== passwordConfirm) {
      setIsError(true);
      setErrorMsg("Passwords do not match");
      return;
    }
    // prepare data to send to register api
    var data = Object.assign({}, newUser);
    data.birthday = birthday.getTime();
    const callback = (res) => {
      if(res.status == 200) {
        props.setIsLoggedIn(true);
        LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", res.data.token);
        LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_USER", res.data.user_id);
      }
    };
    const callbackOnError = (error) => {
      setIsError(true);
      setErrorMsg(error.response.data.message);
    };
    AUTH.register(data, registerPassword, callback, callbackOnError);
  }

  const onChangeRegister = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    var copy = Object.assign({}, newUser);
    copy[name] = value;
    setNewUser(copy);
  }

  return (
    <Jumbotron className="login-jumbotron" fluid>
      <Container>
        <Row>
          <Col>
            <h3> Training Diary </h3>
            <p> A simple application to track and analyze your workout data </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Tabs onSelect={(key) => {
                  if(key === "login") {
                    setLoginEmail("");
                    setLoginPassword("");
                    setIsError(false);
                    setErrorMsg("");
                    setRegisterValidated(false);
                    setLoginValidated(false);
                    setBirthday(null);
                  }
                  else if(key === "register") {
                    setNewUser(Object.assign({}, USER.user));
                    setRegisterPassword("");
                    setPasswordConfirm("");
                    setIsError(false);
                    setErrorMsg("");
                    setRegisterValidated(false);
                    setLoginValidated(false);
                  }
                }}>
                  <Tab eventKey="login" title="Login">
                    <br/>
                    <Form onSubmit={handleLogin} validated={loginValidated} noValidate>
                      <Row>
                        <Col md={6}>
                          <Form.Label> Email </Form.Label>
                          <Form.Control
                            as="input"
                            value={loginEmail}
                            onChange={(e) => {setLoginEmail(e.target.value)}}
                            required
                          />
                        </Col>
                        <Col md={6}>
                        <Form.Label> Password </Form.Label>
                        <Form.Control
                          as="input"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => {setLoginPassword(e.target.value)}}
                          required
                        />
                        </Col>
                      </Row>
                      <Row>
                        <Col className="forgot-password-align">
                          <Button variant="link"> Forgot password? </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="login-button-align">
                          <Button type="submit" variant="info">
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Tab>
                  <Tab eventKey="register" title="Register">
                    <br/>
                    <Form onSubmit={handleRegister} validated={registerValidated} noValidate>
                      <Row>
                        <Col md={6}>
                          <Form.Label> First Name </Form.Label>
                          <Form.Control
                            as="input"
                            name="first_name"
                            value={newUser.first_name}
                            onChange={(e) => {onChangeRegister(e)}}
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label> Last Name </Form.Label>
                          <Form.Control
                            as="input"
                            name="last_name"
                            value={newUser.last_name}
                            onChange={(e) => {onChangeRegister(e)}}
                            required
                          />
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col md={6}>
                          <Form.Label> Email </Form.Label>
                          <Form.Control
                            as="input"
                            name="email"
                            value={newUser.email}
                            onChange={(e) => {onChangeRegister(e)}}
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label> Birthday </Form.Label>
                          <DatePicker
                            className="customDatePickerWidth"
                            placeholderText="Click to select a date"
                            selected={birthday}
                            customInput={
                              <Form.Control
                                as="input"
                                required
                              />
                            }
                            required
                            onChange={(date) => {setBirthday(date)}}
                          />
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col md={6}>
                          <Form.Label> Password </Form.Label>
                          <Form.Control
                            as="input"
                            type="password"
                            name="password"
                            value={registerPassword}
                            onChange={(e) => {setRegisterPassword(e.target.value)}}
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label> Confirm Password </Form.Label>
                          <Form.Control
                            as="input"
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => {setPasswordConfirm(e.target.value)}}
                            required
                          />
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col className="login-button-align">
                          <Button type="submit" variant="info">
                            Register
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    <Row>
                      <Col className="try-out-button-align">
                        Don't want to create an account?
                        <Button className="try-out-button-spacing " variant="info">
                          Try it out!
                        </Button>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
          {isError ?
            <Alert variant="danger" onClose={() => {setIsError(false); setErrorMsg("");}} dismissible>
              {errorMsg}
            </Alert>
          :
            <div></div>
          }
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
}

export default Login;
