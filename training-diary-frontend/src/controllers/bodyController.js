import axios from 'axios';

const BASE_URL = process.env.REACT_APP_DEV_API_HOST;
const BF_BASE = "/api/body_fat";
const BW_BASE = "/api/body_weight";

export const getBodyFatEntries = (token, user_id, callback, callbackOnError) => {
  var endpoint = BASE_URL + BF_BASE + "/get";
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

export const createBodyFatEntry = (token, user_id, bodyFat, callback, callbackOnError) => {
  var endpoint = BASE_URL + BF_BASE + "/create";
  var body = {
    token: token,
    user_id: user_id,
    data: bodyFat
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}
