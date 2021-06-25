import ModelMetaData from './ModelMetaData.js';

export const bodyFat = {
  "bf_id": "",
  "user_id": "",
  "type": "BODY_FAT",
  "timestamp": 0,
  "day": 0,
  "month": 0,
  "year": 0,
  "percentage": 0,
  "notes": ""
};

export const bodyWeight = {
  "bw_id": "",
  "user_id": "",
  "type": "BODY_WEIGHT",
  "timestamp": 0,
  "day": 0,
  "month": 0,
  "year": 0,
  "weight": 0,
  "units": 0,
  "notes": ""
};

export const bodyFatMetaData = [
  new ModelMetaData("bf_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("user_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("type", "string", undefined, "", false, 0, []),
  new ModelMetaData("timestamp", "number", undefined, "", true, 0, []),
  new ModelMetaData("day", "number", undefined, "", false, 0, []),
  new ModelMetaData("month", "number", undefined, "", false, 0, []),
  new ModelMetaData("year", "number", undefined, "", false, 0, []),
  new ModelMetaData("percentage", "number", "input", "Body Fat %", false, 6, []),
  new ModelMetaData("notes", "string", "textarea", "Notes", false, 12, []),
];

export const bodyWeightMetaData = [
  new ModelMetaData("bw_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("user_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("type", "string", undefined, "", false, 0, []),
  new ModelMetaData("timestamp", "number", undefined, "", true, 0, []),
  new ModelMetaData("day", "number", undefined, "", false, 0, []),
  new ModelMetaData("month", "number", undefined, "", false, 0, []),
  new ModelMetaData("year", "number", undefined, "", false, 0, []),
  new ModelMetaData("weight", "number", "input", "", false, 6, []),
  new ModelMetaData("units", "number", "select", "", false, 6, [
    "lbs.",
    "kgs."
  ]),
  new ModelMetaData("notes", "string", "textarea", "Notes", false, 12, []),
];
