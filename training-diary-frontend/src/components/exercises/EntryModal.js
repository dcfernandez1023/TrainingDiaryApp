import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');


/*
   Props:
    * show
    * header
    * entries
    * entryDate: timestamp
    * onClose
    * onSubmitModal
*/
const EntryModal = (props) => {
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [exercises, setExercises] = useState();
  const [entryDate, setEntryDate] = useState(new Date());
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    setShow(props.show);
    setHeader(props.header);
    setExercises(props.exercises);
    if(props.entryDate !== undefined && props.entryDate instanceof Date) {
      setEntryDate(props.entryDate);
    }
  }, [props.show, props.header, props.exercises, props.entryDate]);

  const closeModal = () => {
    props.onClose();
    setValidated(false);
    setShowSpinner(false);
    setSubmitDisabled(false)
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={2}></Col>
          <Col xs={8}>
            <Form.Label> Date Performed </Form.Label>
            <Form.Control
              id="log-date"
              as="input"
              type="date"
              //value={entryDate instanceof Date ? entryDate.toISOString().slice(0, 10) : ""}
            />
          </Col>
          <Col xs={2}></Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <Form.Label> Exercises Performed </Form.Label>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="info"> Done </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EntryModal;
