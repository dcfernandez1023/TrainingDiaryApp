import ModelMetaData from './ModelMetaData.js';

export const exercise = {
  "exercise_id": "",
  "user_id": "",
  "name": "",
  "category": "",
  "sets": 0,
  "reps": 0,
  "amount": 0,
  "units": "",
  "description": ""
}

export const metaData = [
  new ModelMetaData("exercise_id", "string", undefined, "", false, 6, []),
  new ModelMetaData("user_id", "string", undefined, "", false, 6, []),
  new ModelMetaData("name", "string", "input", "Name", true, 6, []),
  new ModelMetaData("category", "string", "select", "Category", true, 6, [
    "Weight-lifting",
    "Body-weight",
    "Stretching",
    "Cardio",
    "Recovery",
    "Other"]),
  new ModelMetaData("sets", "number", "input", "Sets", true, 6, []),
  new ModelMetaData("reps", "number", "input", "Reps", true, 6, []),
  new ModelMetaData("amount", "number", "input", "Amount", true, 6, []),
  new ModelMetaData("units", "string", "select", "Units", true, 6, [
    "lbs.",
    "kgs.",
    "miles",
    "meters",
    "kilometers",
    "None"
  ]),
  new ModelMetaData("description", "string", "textarea", "Description", false, 12, [])
];
