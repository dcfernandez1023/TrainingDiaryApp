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
