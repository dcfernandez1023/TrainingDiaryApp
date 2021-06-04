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

class EntryMetaData {
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
  new EntryMetaData("exercise_entry_id", "string", undefined, "", false, 0, []),
  new EntryMetaData("exercise_id", "string", undefined, "", false, 0, []),
  new EntryMetaData("user_id", "string", undefined, "", false, 0, []),
  new EntryMetaData("timestamp", "number", undefined, "", true, 0, []),
  new EntryMetaData("day", "number", undefined, "", true, 0, []),
  new EntryMetaData("month", "number", undefined, "", true, 0, []),
  new EntryMetaData("year", "number", undefined, "", true, 0, []),
  new EntryMetaData("notes", "string", undefined, "", false, 0, []),
];
