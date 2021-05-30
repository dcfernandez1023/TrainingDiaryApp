import axios from 'axios';

const BASE_URL = process.env.REACT_APP_DEV_API_HOST;
const BASE = "/api/auth";

// refreshes an api token
export const refreshToken = (user_id, token, callback, callbackOnError) => {
  var endpoint = BASE_URL + BASE + "/refresh";
  var body = {
    user_id: user_id,
    token: token
  };
  console.log(body);
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// registers a user
export const register = (newUser, password, callback, callbackOnError) => {
  var endpoint = BASE_URL + BASE + "/register";
  var body = {
    user_data: newUser,
    password: password
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// calls login api
export const login = (email, password, callback, callbackOnError) => {
  var endpoint = BASE_URL + BASE + "/login";
  var body = {
    email: email,
    password: password
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}
