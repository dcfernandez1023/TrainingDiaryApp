import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const MODEL = require('../../models/exercise.js');


/*
   Props:
    * show
    * header
    * exercise
    * onClose
    * onSubmitModal
*/
const ExerciseModal = (props) => {
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [exercise, setExercise] = useState();
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    setShow(props.show);
    setHeader(props.header);
    setExercise(props.exercise);
    setType(props.type);
  }, [props.show, props.header, props.exercise, props.type]);

  const closeModal = () => {
    setValidated(false);
    setShowSpinner(false);
    setSubmitDisabled(false);
    props.onClose();
  }

  const onChangeModalInput = (event) => {
    setValidated(false);
    var copy = Object.assign({}, exercise);
    copy[event.target.name] = event.target.value;
    setExercise(copy);
  }

  // handles modal submit for adding, editing, and deleting an exercise
  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);
    // ensure data types
    var copy = Object.assign({}, exercise);
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
          {MODEL.metaData.map((field) => {
            if(field.element === "input" || field.element === "textarea") {
              return (
                <Col md={field.colSpace} key={field.value} className="exercise-modal-input-spacing">
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    as={field.element}
                    type={field.type === "number" ? "number" : "text"}
                    name={field.value}
                    value={exercise === undefined ? "" : exercise[field.value]}
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
                    value={exercise === undefined ? "" : exercise[field.value]}
                    onChange={(e) => {onChangeModalInput(e)}}
                    readOnly={type === "delete"}
                    disabled={type === "delete"}
                    required={field.required}
                  >
                    <option value="" selected> Select </option>
                    {field.options.map((option, index) => {
                      return (
                        <option value={option} key={index} selected={exercise !== undefined && exercise[field.value] === option}> {option} </option>
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

export default ExerciseModal;
