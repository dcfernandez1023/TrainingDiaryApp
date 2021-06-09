import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Form, InputGroup, Table,  } from 'react-bootstrap';


/*
  * Props:
    * columns - array of strings
    * rows - array of array of strings
    * onClickDelete
    *
*/
const EntryLogs = (props) => {

  return (
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
        {props.rows.map((row) => {
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
        })}
      </tbody>
    </Table>
  );
}

export default EntryLogs;
