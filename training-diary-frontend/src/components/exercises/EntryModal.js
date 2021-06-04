import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal, ListGroup } from 'react-bootstrap';

const MODEL = require('../../models/exerciseEntry.js');
const LOCAL_STORAGE = require('../../util/localStorageHelper.js');


/*
   Props:
    * show
    * entries
    * entryDate: timestamp
    * onClose
    * onSubmitModal
    * createNew
*/
const EntryModal = (props) => {
  const [show, setShow] = useState(false);
  const [exercises, setExercises] = useState();
  const [entryDate, setEntryDate] = useState("");
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [currScreen, setCurrScreen] = useState("date");
  const [exercisesSelcted, setExercisesSelected] = useState({});
  const [note, setNote] = useState("");

  useEffect(() => {
    setShow(props.show);
    setExercises(props.exercises);
    if(props.entryDate !== undefined && props.entryDate instanceof Date) {
      setEntryDate(props.entryDate);
    }
  }, [props.show, props.exercises, props.entryDate]);

  const closeModal = () => {
    props.onClose();
    setValidated(false);
    setShowSpinner(false);
    setEntryDate("");
    setCurrScreen("date");
    setExercisesSelected({});
    setSubmitDisabled(false);
  }

  const onSelectExercise = (exercise_id) => {
    var copy = Object.assign({}, exercisesSelcted);
    if(copy[exercise_id] === undefined) {
      copy[exercise_id] = true;
    }
    else {
      delete copy[exercise_id];
    }
    setExercisesSelected(copy);
  }

  const handleSubmit = () => {
    setShowSpinner(true);
    var entries = [];
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    var date = new Date(entryDate);
    for(var exercise_id in exercisesSelcted) {
      var entry = Object.assign({}, MODEL.exerciseEntry);
      entry.exercise_id = exercise_id;
      entry.user_id = user_id;
      entry.timestamp = date.getTime();
      entry.day = date.getDate() + 1;
      entry.month = date.getMonth() + 1;
      entry.year = date.getFullYear();
      entry.notes = note;
      entries.push(entry);
    }
    props.onSubmitModal(entries, closeModal);
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title> Log Exercise </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {currScreen === "date" ?
        <div>
          <Row>
            <Col></Col>
            <Col xs={8}>
              <Form.Label> Date Performed </Form.Label>
              <Form.Control
                id="log-date"
                as="input"
                type="date"
                onChange={(event) => {
                  setEntryDate(event.target.value);
                }}
                value={entryDate}
              />
            </Col>
            <Col></Col>
          </Row>
          <br/>
          <Row>
            <Col className="entry-modal-next-align">
              <Button variant="info" onClick={() => {setCurrScreen("exercises")}} disabled={entryDate.length == 0}> Next </Button>
            </Col>
          </Row>
        </div>
      :
      currScreen === "exercises" ?
        <div>
          <Row>
            <Col className="entry-modal-create-new-align">
              Select from saved exercises or
              <Button variant="info" size="sm" className="entry-modal-create-new" onClick={props.createNew}> Create New </Button>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <ListGroup>
              {props.exercises.map((exercise) => {
                return (
                  <ListGroup.Item
                    variant={exercisesSelcted[exercise.exercise_id] !== undefined ? "info" : ""}
                    onClick={() => {onSelectExercise(exercise.exercise_id)}}
                    action
                  >
                    {exercise.name} | {exercise.category} | {exercise.sets} x {exercise.reps} @ {exercise.amount} {exercise.units}
                  </ListGroup.Item>
                );
              })}
              </ListGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col className="entry-modal-back-align">
              <Button variant="info" onClick={() => {setCurrScreen("date")}}> Back </Button>
            </Col>
            <Col className="entry-modal-next-align">
              <Button variant="info" onClick={() => {setCurrScreen("notes")}} disabled={Object.keys(exercisesSelcted).length == 0}> Next </Button>
            </Col>
          </Row>
        </div>
      :
      currScreen === "notes" ?
        <div>
          <Row>
            <Col>
              <Form.Label> Add a note </Form.Label>
              <Form.Control
                as="textarea"
                value={note}
                onChange={(event) => {setNote(event.target.value)}}
                rows={4}
              />
            </Col>
          </Row>
          <br/>
          <Row>
            <Col className="entry-modal-back-align">
              <Button variant="info" onClick={() => {setCurrScreen("exercises")}}> Back </Button>
            </Col>
            {showSpinner ?
              <Col className="entry-modal-spinner-align">
                <Spinner animation="border" variant="primary" />
              </Col>
            :
              <div></div>
            }
            <Col className="entry-modal-next-align">
              <Button variant="info" onClick={handleSubmit}> Done </Button>
            </Col>
          </Row>
        </div>
      :
        <div></div>
      }
      </Modal.Body>
    </Modal>
  );
}

export default EntryModal;
