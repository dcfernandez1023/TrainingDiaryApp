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

class ExerciseMetaData {
  constructor(value, type, element, display, required, colSpace, options) {
    this.value = value;
    this.type = type;
    this.element = element;
    this.display = display;
    this.required = required;
    this.colSpace = colSpace;
    this.options = options;
  }
}

export const metaData = [
  new ExerciseMetaData("exercise_id", "string", undefined, "", false, 6, []),
  new ExerciseMetaData("user_id", "string", undefined, "", false, 6, []),
  new ExerciseMetaData("name", "string", "input", "Name", true, 6, []),
  new ExerciseMetaData("category", "string", "select", "Category", true, 6, [
    "Weight-lifting",
    "Body-weight",
    "Stretching",
    "Cardio",
    "Recovery",
    "Other"]),
  new ExerciseMetaData("sets", "number", "input", "Sets", true, 6, []),
  new ExerciseMetaData("reps", "number", "input", "Reps", true, 6, []),
  new ExerciseMetaData("amount", "number", "input", "Amount", true, 6, []),
  new ExerciseMetaData("units", "string", "select", "Units", true, 6, [
    "lbs.",
    "kgs.",
    "miles",
    "meters",
    "kilometers",
    "None"
  ]),
  new ExerciseMetaData("description", "string", "textarea", "Description", false, 12, [])
];
