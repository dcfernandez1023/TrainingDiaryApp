import ModelMetaData from './ModelMetaData.js';

export const diet = {
  "diet_id": "",
  "user_id": "",
  "timestamp": 0,
  "day": 0,
  "month": 0,
  "year": 0,
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "notes": ""
};

export const metaData = [
  new ModelMetaData("diet_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("user_id", "string", undefined, "", false, 0, []),
  new ModelMetaData("timestamp", "number", undefined, "", true, 0, []),
  new ModelMetaData("day", "number", undefined, "", false, 0, []),
  new ModelMetaData("month", "number", undefined, "", false, 0, []),
  new ModelMetaData("year", "number", undefined, "", false, 0, []),
  new ModelMetaData("calories", "number", "input", "Calories", true, 6, []),
  new ModelMetaData("protein", "number", "input", "Protein", true, 6, []),
  new ModelMetaData("carbs", "number", "input", "Carbs", true, 6, []),
  new ModelMetaData("fat", "number", "input", "Fat", true, 6, []),
  new ModelMetaData("notes", "string", "textarea", "Notes", false, 12, []),
];
