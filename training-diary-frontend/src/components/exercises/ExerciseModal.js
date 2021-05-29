import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const MODEL = require('../../models/exercise.js');


/*
  Required props:
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

  useEffect(() => {
    setShow(props.show);
    setHeader(props.header);
    setExercise(props.exercise);
  }, [props.show, props.header, props.exercise]);

  const onChangeModalInput = (event) => {
    setValidated(false);
    var copy = Object.assign({}, exercise);
    copy[event.target.name] = event.target.value;
    setExercise(copy);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);

  }

  return (
    <Modal show={show} onHide={() => {props.onClose(); setValidated(false);}} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Modal.Body>
          <Row>
          {MODEL.metaData.map((field) => {
            console.log(field.required);
            if(field.element === "input") {
              return (
                <Col md={6} key={field.value} className="exercise-modal-input-spacing">
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    as={field.element}
                    type={field.type === "number" ? "number" : "text"}
                    name={field.value}
                    value={exercise === undefined ? "" : exercise[field.value]}
                    onChange={(e) => {onChangeModalInput(e)}}
                    required={field.required}
                  />
                </Col>
              );
            }
            else if(field.element === "select") {
              return (
                <Col md={6} key={field.value} className="exercise-modal-input-spacing">
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    as={field.element}
                    name={field.value}
                    value={exercise === undefined ? "" : exercise[field.value]}
                    onChange={(e) => {onChangeModalInput(e)}}
                    required={field.required}
                  >
                    <option value="" selected> Select </option>
                    {field.options.map((option, index) => {
                      return (
                        <option value={option} key={index}> {option} </option>
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
          <Button type="submit" variant="info"> Done </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ExerciseModal;
