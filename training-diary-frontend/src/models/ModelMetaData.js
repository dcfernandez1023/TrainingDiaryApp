class ModelMetaData {
  /*
    @param value - the name for this piece of data
    @param type - the data type of this piece of data
    @param element - the HTML element type to represent this piece of data
    @param display - the display name for this piece of data
    @param required - boolean determining whether or not this piece of data is required to be entered
                      by the user
    @param colSpace - the number of columns this element should take up (based on HTML Bootstrap Grid Layout)
    @param options - array of options for select HTML elements 
  */
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

export default ModelMetaData;
