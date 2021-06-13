import ModelMetaData from './ModelMetaData.js';

export const exerciseEntry = {
  "exercise_entry_id": "",
  "exercise_id": "",
  "user_id": "",
  "timestamp": 0,
  "day": 0,
  "month": 0,
  "year": 0,
  "notes": "",
};

export const metaData = [
  new ModelMetaData("exercise_entry_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("exercise_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("user_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("timestamp", "number", undefined, "", true, 0, []),
  new ModelMetaData("day", "number", undefined, "", true, 0, []),
  new ModelMetaData("month", "number", undefined, "", true, 0, []),
  new ModelMetaData("year", "number", undefined, "", true, 0, []),
  new ModelMetaData("notes", "string", undefined, "", false, 0, []),
];
