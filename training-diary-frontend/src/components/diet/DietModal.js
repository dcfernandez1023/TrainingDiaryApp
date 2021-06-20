import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const MODEL = require('../../models/diet.js');
const UTIL = require('../../util/util.js');


/*
   Props:
    * show
    * header
    * diet
    * type
    * onClose
    * onSubmitModal
*/
const DietModal = (props) => {
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [diet, setDiet] = useState();
  const [type, setType] = useState("");
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    setShow(props.show);
    setHeader(props.header);
    setDiet(props.diet);
    setType(props.type);
  }, [props.show, props.header, props.diet, props.type]);


  const onChangeModalInput = (event) => {
    setValidated(false);
    var copy = Object.assign({}, diet);
    copy[event.target.name] = event.target.value;
    setDiet(copy);
  }

  const closeModal = () => {
    setValidated(false);
    setShowSpinner(false);
    setSubmitDisabled(false);
    props.onClose();
  }

  // handles modal submit for adding, editing, and deleting an exercise
  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);
    if(diet.timestamp === 0 || diet.timestamp === null) {
      return;
    }
    // ensure data types
    var copy = Object.assign({}, diet);
    // get date
    if(type === "add") {
      var dateObj = new Date(diet.timestamp);
      copy.timestamp = dateObj.getTime();
      copy.day = dateObj.getDate() + 1;
      copy.month = dateObj.getMonth() + 1;
      copy.year = dateObj.getFullYear();
    }
    console.log(copy);
    for(var i = 0; i < MODEL.metaData.length; i++) {
      var field = MODEL.metaData[i];
      if(copy[field.value].toString().trim().length == 0 && field.required && type !== "delete") {
        return;
      }
      if(field.type === "number") {
        copy[field.value] = parseInt(copy[field.value]);
      }
    }
    setShowSpinner(true);
    setSubmitDisabled(true);
    props.onSubmitModal(copy, closeModal);
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Modal.Body>
          <Row>
            <Col xs={2}></Col>
            <Col className="exercise-modal-input-spacing">
              <Form.Label> Date </Form.Label>
              <DatePicker
                className="customDatePickerWidth"
                placeholderText="Click to select a date"
                selected={diet === undefined || diet.timestamp == 0 ? null : new Date(diet.timestamp)}
                customInput={
                  <Form.Control
                    as="input"
                    required
                  />
                }
                required
                onChange={(date) => {
                  var copy = Object.assign({}, diet);
                  copy.timestamp = date.getTime();
                  setDiet(copy);
                }}
              />
              {/*
              <Form.Control
                id="diet-date"
                as="input"
                type="date"
                defaultValue={diet === undefined || diet.timestamp === 0 ? "" : UTIL.formatDate(diet.timestamp)}
                required
                disabled={type === "delete" || type === "edit"}
              />
              */}
            </Col>
            <Col xs={2}></Col>
          </Row>
          <Row>
          {MODEL.metaData.map((field) => {
            if(field.element === "input" || field.element === "textarea") {
              return (
                <Col md={field.colSpace} key={field.value} className="exercise-modal-input-spacing">
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    as={field.element}
                    type={field.type === "number" ? "number" : "text"}
                    name={field.value}
                    value={diet === undefined ? "" : diet[field.value]}
                    onChange={(e) => {onChangeModalInput(e)}}
                    rows={field.element === "textarea" ? 4 : undefined}
                    readOnly={type === "delete"}
                    required={field.required}
                  />
                </Col>
              );
            }
            else if(field.element === "select") {
              return (
                <Col md={field.colSpace} key={field.value} className="exercise-modal-input-spacing">
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    as={field.element}
                    name={field.value}
                    value={diet === undefined ? "" : diet[field.value]}
                    onChange={(e) => {onChangeModalInput(e)}}
                    readOnly={type === "delete"}
                    disabled={type === "delete"}
                    required={field.required}
                  >
                    <option value="" selected> Select </option>
                    {field.options.map((option, index) => {
                      return (
                        <option value={option} key={index} selected={diet !== undefined && diet[field.value] === option}> {option} </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              );
            }
          })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
        {showSpinner ?
          <Spinner animation="border" variant="primary" />
        :
          <div></div>
        }
        {type === "delete" ?
          <Button type="submit" variant="danger" disabled={submitDisabled}> Delete </Button>
        :
          <Button type="submit" variant="info" disabled={submitDisabled}> Done </Button>
        }
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DietModal;
