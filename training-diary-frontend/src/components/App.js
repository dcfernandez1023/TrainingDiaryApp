import React, { useState, useEffect } from 'react';

import { Spinner } from 'react-bootstrap';

import Login from './login/Login.js';
import Home from './Home.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/customDatePicker.css';
import '../styles/App.css';

const AUTH = require('../controllers/auth.js');
const LOCAL_STORAGE = require('../util/localStorageHelper.js');


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = () => {
    LOCAL_STORAGE.initTrainingDiaryStorage();
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    if(user_id.trim().length == 0 || token.trim().length == 0) {
      setIsLoggedIn(false);
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        console.log(res);
        LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", res.data.token);
        setIsLoggedIn(true);
      }
    };
    const callbackOnError = (error) => {
      console.log(error.response);
      LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_USER", "");
      LOCAL_STORAGE.setStorageItem("TRAINING_DIARY_API_TOKEN", "");
      setIsLoggedIn(false);
    }
    AUTH.refreshToken(user_id, token, callback, callbackOnError);
  }

  if(isLoggedIn === undefined) {
    return (
      <div>
        <br/>
        <div className="spinner-align">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  return (
    <div className="parent-div">
    {!isLoggedIn ?
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
      :
      <Home
        setIsLoggedIn={setIsLoggedIn}
      />
    }
    </div>
  );
}

export default App;
