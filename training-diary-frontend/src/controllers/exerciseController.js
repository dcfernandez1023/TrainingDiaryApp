import axios from 'axios';

const BASE_URL = process.env.REACT_APP_DEV_API_HOST;
const BASE = "/api/exercise";

// gets user's exercises from database
export const getExercises = (token, user_id, callback, callbackOnError) => {
  var config = {
    headers: {
      token: token,
      user_id: user_id
    }
  };
  var endpoint = BASE_URL + BASE + "/get";
  axios.get(endpoint, config)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}
