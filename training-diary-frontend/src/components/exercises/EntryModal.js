import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal, ListGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const MODEL = require('../../models/exerciseEntry.js');
const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const UTIL = require('../../util/util.js');


/*
   Props:
    * show
    * exercises
    * type
    * entry
    * exercise
    * entryDate: timestamp
    * onClose
    * onSubmitModal
    * createNew
*/
const EntryModal = (props) => {
  const [show, setShow] = useState(false);
  const [exercises, setExercises] = useState();
  const [type, setType] = useState("");
  const [entry, setEntry] = useState({});
  const [exercise, setExercise] = useState();
  const [entryDate, setEntryDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [currScreen, setCurrScreen] = useState("date");
  const [exercisesSelcted, setExercisesSelected] = useState({});
  const [note, setNote] = useState("");

  useEffect(() => {
    setShow(props.show);
    setExercises(props.exercises);
    setType(props.type);
    setExercise(props.exercise);
    if(props.entry !== undefined) {
      setEntry(props.entry);
      setEntryDate(new Date(props.entry.timestamp));
    }
  }, [props.show, props.exercises, props.entryDate, props.entry]);

  const closeModal = () => {
    props.onClose();
    setValidated(false);
    setShowSpinner(false);
    setEntryDate("");
    setCurrScreen("date");
    setExercisesSelected({});
    setSubmitDisabled(false);
    setValidated(false);
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

  const handleSubmit = (e, entryEdit) => {
    setShowSpinner(true);
    if(type === "delete") {
      setSubmitDisabled(true);
      props.onSubmitModal(props.entry.exercise_entry_id, closeModal);
    }
    else if(type === "edit") {
      e.preventDefault();
      setValidated(true);
      if(entryDate === null) {
        setShowSpinner(false);
        return;
      }
      setSubmitDisabled(true);
      var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
      entryEdit.timestamp = entryDate.getTime();
      entryEdit.day = entryDate.getDate() + 2;
      entryEdit.month = entryDate.getMonth() + 2;
      entryEdit.year = entryDate.getFullYear();
      entryEdit.notes = entryEdit.notes;
      props.onSubmitModal(entryEdit, closeModal);
    }
    else {
      setSubmitDisabled(true);
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
  }

  if(type === "edit") {
    return (
      <Modal show={show} onHide={closeModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title> {props.header} </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
            handleSubmit(e, entry);
          }}
          noValidate validated={validated}>
          <Modal.Body>
            <Row>
              <Col></Col>
              <Col xs={8}>
                <Form.Label> Date Performed </Form.Label>
                <DatePicker
                  className="customDatePickerWidth"
                  placeholderText="Click to select a date"
                  selected={entryDate}
                  customInput={
                    <Form.Control
                      as="input"
                      required
                    />
                  }
                  required
                  onChange={(date) => {setEntryDate(date)}}
                />
                {/*
                <Form.Control
                  id="log-date-edit"
                  as="input"
                  type="date"
                  defaultValue={entry === undefined ? "" : UTIL.formatDate(new Date(entry.timestamp).toLocaleDateString())}
                  onChange={(event) => {
                    setValidated(false);
                    setEntryDate(event.target.value);
                  }}
                  required
                />
                */
              }
              </Col>
              <Col></Col>
            </Row>
            <br/>
            <Row>
              <Col>
                <Form.Label> Exercise </Form.Label>
                <ListGroup.Item>
                  {exercise === undefined ? "" : exercise.name + " | " + exercise.category + " | " + exercise.sets + " x " + exercise.reps + " @ " + exercise.amount + " " + exercise.units}
                </ListGroup.Item>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col>
                <Form.Label> Notes </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={entry.notes}
                  onChange={(e) => {
                    setValidated(false);
                    var copy = Object.assign({}, entry);
                    copy.notes = e.target.value;
                    setEntry(copy);
                  }}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
          {showSpinner ?
            <Spinner animation="border" variant="primary" />
          :
            <div></div>
          }
            <Button type="submit" variant="info" disabled={submitDisabled}> Done </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
  else if(type === "delete") {
    return (
      <Modal show={show} onHide={closeModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title> {props.header} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              {entry === undefined ? "" : new Date(entry.timestamp).toLocaleDateString()}
            </Col>
          </Row>
          <Row>
            <Col>
              {exercise === undefined ? "" : exercise.name + " | " + exercise.category + " | " + exercise.sets + " x " + exercise.reps + " @ " + exercise.amount + " " + exercise.units}
            </Col>
          </Row>
          <Row>
            <Col>
              <i> {entry === undefined ? "" : entry.notes} </i>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
        {showSpinner ?
          <Spinner animation="border" variant="primary" />
        :
          <div></div>
        }
          <Button variant="danger" onClick={handleSubmit} disabled={submitDisabled}> Delete </Button>
        </Modal.Footer>
      </Modal>
    );
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
              <DatePicker
                className="customDatePickerWidth"
                placeholderText="Click to select a date"
                selected={entryDate}
                customInput={
                  <Form.Control
                    as="input"
                    required
                  />
                }
                required
                onChange={(date) => {setEntryDate(date)}}
              />
              {/*
              <Form.Control
                id="log-date"
                as="input"
                type="date"
                onChange={(event) => {
                  setEntryDate(event.target.value);
                }}
                value={entryDate}
              />
              */}
            </Col>
            <Col></Col>
          </Row>
          <br/>
          <Row>
            <Col className="entry-modal-next-align">
              <Button variant="info" onClick={() => {setCurrScreen("exercises")}} disabled={entryDate === null}> Next </Button>
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
              <Button variant="info" onClick={handleSubmit} disabled={submitDisabled}> Done </Button>
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
