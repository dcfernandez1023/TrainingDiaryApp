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
  constructor(value, type, element, display, required, options) {
    this.value = value;
    this.type = type;
    this.element = element;
    this.display = display;
    this.required = required;
    this.options = options;
  }
}

export const metaData = [
  new ExerciseMetaData("exercise_id", "string", undefined, "", false, []),
  new ExerciseMetaData("user_id", "string", undefined, "", false, []),
  new ExerciseMetaData("name", "string", "input", "Name", true, []),
  new ExerciseMetaData("category", "string", "select", "Category", true, [
    "Weight-lifting",
    "Body-weight",
    "Stretching",
    "Cardio",
    "Recovery",
    "Other"]),
  new ExerciseMetaData("sets", "number", "input", "Sets", true, []),
  new ExerciseMetaData("reps", "number", "input", "Reps", true, []),
  new ExerciseMetaData("amount", "number", "input", "Amount", true, []),
  new ExerciseMetaData("units", "string", "select", "Units", true, [
    "lbs.",
    "kgs.",
    "miles",
    "meters",
    "kilometers"
  ]),
  new ExerciseMetaData("description", "string", "input", "Description", false, [])
];
