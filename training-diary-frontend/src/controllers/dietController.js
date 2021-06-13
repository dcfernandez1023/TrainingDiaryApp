import axios from 'axios';

const BASE_URL = process.env.REACT_APP_DEV_API_HOST;
const BASE = "/api/diet";

// gets user's diet entries
export const getDietEntries = (token, user_id, callback, callbackOnError) => {
  var endpoint = BASE_URL + BASE + "/get";
  var config = {
    headers: {
      token: token,
      user_id: user_id
    }
  };
  axios.get(endpoint, config)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
  }

// create diet entry
export const createDiet = (token, user_id, diet, callback, callbackOnError) => {
  var endpoint = BASE_URL + BASE + "/create";
  var body = {
    token: token,
    user_id: user_id,
    data: diet
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}
