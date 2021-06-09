import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Form, InputGroup, Table, Spinner } from 'react-bootstrap';


/*
  * Props:
    * columns - array of strings
    * rows - array of array of strings
    * onClickDelete
    * sortRecent
    * sortOldest
*/
const EntryLogs = (props) => {
  const [searching, setSearching] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  /*
    * Helper function to get the end index of the substring with in @param string.
    * This function assumes that @param searchString is a substring of @param string
  */
  const getEndIndex = (string, searchString, startIndex) => {
    var n = 0;
    for(var i = startIndex; i < string.length; i++) {
      // ensure we don't go out of bounds
      if(n >= searchString.length) {
        break;
      }
      if(string.charAt(i) === searchString.charAt(n)) {
        n++;
      }
    }
    return n-1;
  }

  /* Filters the table rows based on the user's search */
  const filterSearch = (searchString) => {
    if(searchString.trim().length === 0) {
      setSearching(false);
      return;
    }
    setSearching(true);
    setShowSpinner(true);
    var filteredRows = [];
    for(var i = 0; i < props.rows.length; i++) {
      var row = props.rows[i];
      var rowCopy = Object.assign({}, row);
      var isMatch = false;
      for(var n = 0; n < row.data.length; n++) {
        delete row.data[n].startIndex;
        delete row.data[n].endIndex;
        var value = row.data[n].value;
        if(row.data[n].key === "timestamp") {
          value = new Date(value).toLocaleDateString();
        }
        var startIndex = value.indexOf(searchString);
        if(startIndex != -1) {
          var endIndex = getEndIndex(value, searchString, startIndex);
          isMatch = true;
          var fieldCopy = Object.assign({}, rowCopy.data[n]);
          fieldCopy.startIndex = startIndex;
          fieldCopy.endIndex = endIndex;
          rowCopy.data[n] = fieldCopy;
        }
      }
      if(isMatch) {
        filteredRows.push(row);
      }
    }
    setShowSpinner(false);
    setFiltered(filteredRows);
    console.log(filteredRows);
  }

  /* Helper function to highlight the searched portion of the text */
  const highlightSearchText = (start, end, text) => {
    if(start === undefined || end === undefined) {
      return text;
    }
    var beforeStart = text.substr(0, start);
    var highlight = text.substr(start, end - start + 1);
    var afterEnd = text.substr(end + 1);
    return <div>{beforeStart}<mark>{highlight}</mark>{afterEnd}</div>;
  }

  return (
    <div>
      <Row>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text> Search </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as="input"
              onChange={(e) => {filterSearch(e.target.value)}}
            />
          </InputGroup>
        </Col>
        <Col md={2}></Col>
        <Col md={4} className="right-align">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text> Sort By </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as="select"
              onChange={(e) => {
                var value = e.target.value;
                if(value === "recent") {
                  props.sortRecent();
                }
                else if(value === "oldest") {
                  props.sortOldest();
                }
              }}
            >
              <option value="recent" selected> Most Recent </option>
              <option value="oldest"> Oldest </option>
            </Form.Control>
          </InputGroup>
        </Col>
      </Row>
      <br/>
      {showSpinner ?
        <Spinner animation="border" />
      :
      <Table responsive bordered>
        <thead>
          <th> # </th>
          {props.columns.map((column) => {
            return (
              <th> {column} </th>
            );
          })}
        </thead>
        <tbody>
          {!searching ? props.rows.map((row) => {
            return (
              <tr>
                <td>
                  <Button variant="outline-dark" size="sm" onClick={() => {props.onClickDelete("delete", row.entry)}}> 🗑️ </Button>
                </td>
                {row.data.map((data) => {
                  if(data.key === "timestamp") {
                    return (
                      <td> {new Date(data.value).toLocaleDateString()} </td>
                    );
                  }
                  return (
                    <td> {data.value} </td>
                  );
                })}
              </tr>
            );
          })
          :
          filtered.map((row) => {
            return (
              <tr>
                <td>
                  <Button variant="outline-dark" size="sm" onClick={() => {props.onClickDelete("delete", row.entry)}}> 🗑️ </Button>
                </td>
                {row.data.map((data) => {
                  if(data.key === "timestamp") {
                    return (
                      <td> {highlightSearchText(data.startIndex, data.endIndex, new Date(data.value).toLocaleDateString())} </td>
                    );
                  }
                  return (
                    <td> {highlightSearchText(data.startIndex, data.endIndex, data.value)} </td>
                  );
                })}
              </tr>
            );
          })
        }
        </tbody>
      </Table>
    }
    </div>
  );
}

export default EntryLogs;
