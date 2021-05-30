import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Tabs, Tab, Card, Alert, Form, Dropdown, InputGroup, DropdownButton, Table, ListGroup } from 'react-bootstrap';

import FatalError from '../generic/FatalError.js';
import ExerciseModal from './ExerciseModal.js';

import '../../styles/exercise.css';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const CONTROLLER = require('../../controllers/exerciseController.js');
const MODEL = require('../../models/exercise.js');


const Exercise = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [exercises, setExercises] = useState();
  const [entries, setEntries] = useState();
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalExercise, setModalExercise] = useState();
  const [modalType, setModalType] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");

  useEffect(() => {
    getExercises();
    getEntries();
  }, []);

  const getExercises = () => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      setExercises(res.data.data);
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getExercises(token, user_id, callback, callbackOnError);
  }

  const createExercise = (newExercise, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = exercises.slice();
        copy.push(res.data.data);
        setExercises(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.createExercise(token, user_id, newExercise, callback, callbackOnError);
  }

  const editExercise = (exercise, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = exercises.slice();
        for(var i = 0; i < copy.length; i++) {
          if(res.data.data.exercise_id === copy[i].exercise_id) {
            copy[i] = res.data.data;
          }
        }
        setExercises(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.editExercise(token, user_id, exercise, callback, callbackOnError);
  }

  const deleteExercise = (exercise, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = exercises.slice();
        for(var i = 0; i < copy.length; i++) {
          if(res.data.data === copy[i].exercise_id) {
            copy.splice(i, 1);
            break;
          }
        }
        setExercises(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.deleteExercise(token, user_id, exercise, callback, callbackOnError);
  }

  const getEntries = () => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        setEntries(res.data.data);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getEntries(token, user_id, callback, callbackOnError);
  }

  const openAddModal = () => {
    setAddShow(true);
    setModalHeader("Add Exercise");
    setModalType("add");
    setModalExercise(Object.assign({}, MODEL.exercise));
  }

  const closeAddModal = () => {
    setAddShow(false);
    setModalHeader("");
    setModalType("");
    setModalExercise();
  }

  const openEditModal = (exercise_id) => {
    setEditShow(true);
    setModalHeader("Edit Exercise");
    setModalType("edit");
    // find exercise
    for(var i = 0; i < exercises.length; i++) {
      var curr = exercises[i];
      if(curr.exercise_id === exercise_id) {
        setModalExercise(Object.assign({}, curr));
        return;
      }
    }
    setIsFatal(true);
    setFatalMsg("No such exercise exists");
  }

  const closeEditModal = () => {
    setEditShow(false);
    setModalHeader("");
    setModalType("");
    setModalExercise();
  }

  const openDeleteModal = (exercise_id) => {
    setDeleteShow(true);
    setModalHeader("Delete Exercise");
    setModalType("delete");
    for(var i = 0; i < exercises.length; i++) {
      var curr = exercises[i];
      if(curr.exercise_id === exercise_id) {
        setModalExercise(Object.assign({}, curr));
        return;
      }
    }
    setIsFatal(true);
    setFatalMsg("No such exercise exists");
  }

  const closeDeleteModal = () => {
    setDeleteShow(false);
    setModalHeader("");
    setModalType("");
    setModalExercise();
  }

  const selectEntryOnTable = (entryId) => {
    if(selectedEntryId === entryId) {
      setSelectedEntryId("");
    }
    else {
      setSelectedEntryId(entryId);
    }
  }

  if(isFatal) {
    return (
      <FatalError
        errorMsg={fatalMsg}
      />
    );
  }
  if(exercises === undefined || entries === undefined) {
    return (
      <Row>
        <Col className="spinner-align">
          <Spinner animation="grow"/>
        </Col>
      </Row>
    );
  }
  return (
    <Container>
      <ExerciseModal
        show={addShow ? addShow : editShow ? editShow : deleteShow ? deleteShow : false}
        header={modalHeader}
        exercise={modalExercise}
        onClose={addShow ? closeAddModal: editShow ? closeEditModal : deleteShow ? closeDeleteModal :undefined}
        onSubmitModal={addShow ? createExercise : editShow ? editExercise : deleteShow ? deleteExercise : undefined}
        type={modalType}
      />
      <Row>
        <Col xs={10}>
          <h3> Exercises 💪 </h3>
        </Col>
        <Col xs={2} className="add-button-align">
          <DropdownButton title="⚙️" variant="outline-dark" menuAlign="right">
            <Dropdown.Item onClick={openAddModal}> Add an Exercise </Dropdown.Item>
            <Dropdown.Item> Log an Exercise </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="saved">
        <Tab eventKey="saved" title="Saved">
          <br/>
          <div>
          {exercises.length == 0 ?
            <p className="no-exercises-align"> You have no saved exercises </p>
          :
            <Row>
              {exercises.map((exercise) => {
                return (
                  <Col lg={4} key={exercise.exercise_id} className="exercise-card-spacing">
                    <Card
                      bg="light"
                      text="dark"
                      className="exercise-card-height"
                    >
                      <Card.Header>
                        {exercise.name}
                        <Button size="sm" variant="outline-dark" className="exercise-card-buttons"
                          onClick={() => {openDeleteModal(exercise.exercise_id)}}
                        >
                          🗑️
                        </Button>
                        <Button size="sm" variant="outline-dark" className="exercise-card-buttons"
                          onClick={() => {openEditModal(exercise.exercise_id)}}
                        >
                          ✏️
                        </Button>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col>
                            <strong> {exercise.category} </strong>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {exercise.sets} x {exercise.reps} @ {exercise.amount} {exercise.units}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <i> {exercise.description} </i>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          }
          </div>
        </Tab>
        <Tab eventKey="logs" title="Logs">
          <br/>
          <Row>
            <Col xs={6}>
              <InputGroup>
                <DropdownButton variant="dark" title="Sort By" className="sort-by-button">
                </DropdownButton>
                <Form.Control
                  as="input"
                />
              <InputGroup.Append>
                  <Button variant="outline-dark"> Search </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col xs={6} className="edit-delete-table-align">
              <Button variant="outline-dark" className="edit-delete-table-buttons" disabled={selectedEntryId.length === 0}> ✏️ </Button>
              <Button variant="outline-dark" className="edit-delete-table-buttons" disabled={selectedEntryId.length === 0}> 🗑️ </Button>
            </Col>
          </Row>
          <br/>
          {entries.length == 0 ?
            <p className="no-exercises-align"> You have not logged any exercises </p>
          :
            <Table responsive bordered hover>
              <thead>
                <th> Date </th>
                <th> Exercise Performed </th>
                <th> Notes </th>
              </thead>
              <tbody>
              {entries.map((entry) => {
                return (
                  <tr
                    id={entry.exercise_entry_id}
                    key={entry.exercise_entry_id}
                    className={selectedEntryId === entry.exercise_entry_id ? "selected-entry": ""}
                    onClick={() => {selectEntryOnTable(entry.exercise_entry_id)}}
                    action
                  >
                    <td> {new Date(entry.timestamp).toLocaleDateString()} </td>
                    <td> * Sets, reps, and amount will go here * </td>
                    <td> {entry.notes} </td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          }
        </Tab>
        <Tab eventKey="insights" title="Insights">
        </Tab>
      </Tabs>
      <br/>
    </Container>
  );
}

export default Exercise;
