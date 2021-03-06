import axios from 'axios';

const BASE_URL = process.env.REACT_APP_DEV_API_HOST;
const EXERCISE_BASE = "/api/exercise";
const ENTRY_BASE = "/api/exercise_entry";

// gets user's exercises from database
export const getExercises = (token, user_id, callback, callbackOnError) => {
  var endpoint = BASE_URL + EXERCISE_BASE + "/get";
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

// creates an exercise
export const createExercise = (token, user_id, newExercise, callback, callbackOnError) => {
  var endpoint = BASE_URL + EXERCISE_BASE + "/create";
  newExercise.user_id = user_id;
  var body = {
    token: token,
    user_id: user_id,
    data: newExercise
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// edits an exercise
export const editExercise = (token, user_id, editedExercise, callback, callbackOnError) => {
  var endpoint = BASE_URL + EXERCISE_BASE + "/update";
  var body = {
    token: token,
    user_id: user_id,
    data: editedExercise
  };
  axios.put(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// deletes an exercise
export const deleteExercise = (token, user_id, exercise, callback, callbackOnError) => {
  var endpoint = BASE_URL + EXERCISE_BASE + "/delete";
  var body = {
    token: token,
    user_id: user_id,
    exercise_id: exercise.exercise_id
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// gets user's exercise entries
export const getEntries = (token, user_id, callback, callbackOnError) => {
  var endpoint = BASE_URL + ENTRY_BASE + "/get";
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

// creates entries
export const createEntries = (token, user_id, entries, callback, callbackOnError) => {
  var endpoint = BASE_URL + ENTRY_BASE + "/create_many";
  var body = {
    token: token,
    user_id: user_id,
    data: entries
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// edits an entry
export const editEntry = (token, user_id, entry, callback, callbackOnError) => {
  var endpoint = BASE_URL + ENTRY_BASE + "/update";
  var body = {
    token: token,
    user_id: user_id,
    data: entry
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}

// deletes an entry
export const deleteEntry = (token, user_id, exercise_entry_id, callback, callbackOnError) => {
  var endpoint = BASE_URL + ENTRY_BASE + "/delete";
  var body = {
    token: token,
    user_id: user_id,
    exercise_entry_id: exercise_entry_id
  };
  axios.post(endpoint, body)
    .then((res) => {
      callback(res);
    }, (error) => {
      callbackOnError(error);
    });
}
