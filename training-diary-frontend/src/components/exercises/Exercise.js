import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Tabs, Tab, Card, Alert, Form, Dropdown, InputGroup, DropdownButton, Table, ListGroup } from 'react-bootstrap';

import FatalError from '../generic/FatalError.js';
import ExerciseModal from './ExerciseModal.js';
import EntryModal from './EntryModal.js';

import '../../styles/exercise.css';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const CONTROLLER = require('../../controllers/exerciseController.js');
const MODEL = require('../../models/exercise.js');


const Exercise = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [exercises, setExercises] = useState();
  const [exerciseLookup, setExerciseLookup] = useState({});
  const [entries, setEntries] = useState();
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [entryShow, setEntryShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalExercise, setModalExercise] = useState();
  const [modalType, setModalType] = useState("");
  const [modalEntry, setModalEntry] = useState();
  const [editingTable, setEditingTable] = useState(false);

  useEffect(() => {
    getExercises();
    getEntries();
  }, []);

  const generateExerciseLookup = (exercises) => {
    var lookup = {};
    for(var i = 0; i < exercises.length; i++) {
      var exercise = exercises[i];
      lookup[exercise.exercise_id] = exercise;
    }
    setExerciseLookup(lookup);
  }

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
      generateExerciseLookup(res.data.data);
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
        generateExerciseLookup(copy);
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
        generateExerciseLookup(copy);
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
        var copyEntries = [];
        for(var i = 0; i < copy.length; i++) {
          if(res.data.data === copy[i].exercise_id) {
            copy.splice(i, 1);
            break;
          }
        }
        setExercises(copy);
        generateExerciseLookup(copy);
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

  const createEntries = (newEntries, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = entries.slice();
        for(var i = 0; i < res.data.data.length; i++) {
          var entry = res.data.data[i];
          copy.push(entry);
        }
        console.log(entries);
        setEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.createEntries(token, user_id, newEntries, callback, callbackOnError);
  }

  const deleteEntry = (exercise_entry_id, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = entries.slice();
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].exercise_entry_id === res.data.data) {
            copy.splice(i, 1);
            break;
          }
        }
        setEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.deleteEntry(token, user_id, exercise_entry_id, callback, callbackOnError);
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

  const openEntryModal = (type, entry, exercise) => {
    setEntryShow(true);
    if(type === "delete") {
      console.log(entry);
      setModalHeader("Delete Log");
      setModalType(type);
      setModalEntry(entry);
      setModalExercise(exercise);
    }
    else {
      setModalHeader("Log Exercise");
    }
  }

  const closeEntryModal = () => {
    setEntryShow(false);
    setModalHeader("");
    setModalType("");
    setModalEntry();
    setModalExercise();
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
      <EntryModal
        show={entryShow}
        exercises={exercises}
        header={modalHeader}
        type={modalType}
        entry={modalEntry}
        exercise={modalExercise}
        onClose={closeEntryModal}
        onSubmitModal={modalType === "delete" ? deleteEntry : createEntries}
        createNew={openAddModal}
      />
      <Row>
        <Col xs={10}>
          <h3> Exercises 💪 </h3>
        </Col>
        <Col xs={2} className="add-button-align">
          <DropdownButton title="⚙️" variant="outline-dark" menuAlign="right">
            <Dropdown.Item onClick={openAddModal}> Add an Exercise </Dropdown.Item>
            <Dropdown.Item onClick={openEntryModal}> Log an Exercise </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="saved">
        <Tab eventKey="saved" title="Saved ⬇️">
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
        <Tab eventKey="logs" title="Logs 📝">
          <br/>
          <Row>
            <Col xs={6}>
              <InputGroup>
                <Form.Control
                  as="input"
                />
                <InputGroup.Append>
                  <Button variant="info"> Search </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col xs={6} className="right-align">
              <DropdownButton variant="info" title="Sort By" className="sort-by-button"> </DropdownButton>
            </Col>
            {/*
            <Col xs={6} className="edit-delete-table-align">
            {editingTable ?
              <Button variant="outline-dark" className="edit-delete-table-buttons" onClick={() => {setEditingTable(false)}}> ✔️ </Button>
            :
              <Button variant="outline-dark" className="edit-delete-table-buttons" onClick={() => {setEditingTable(true)}}> ✏️ </Button>
            }
            </Col>
            */}
          </Row>
          <br/>
          {entries.length == 0 ?
            <p className="no-exercises-align"> You have not logged any exercises </p>
          :
            <Table responsive bordered>
              <thead>
              {editingTable ?
                <th> # </th>
              :
                <div></div>
              }
                <th> # </th>
                <th> Date </th>
                <th> Exercise Performed </th>
                <th> Notes </th>
              </thead>
              <tbody>
              {entries.map((entry) => {
                var exercise = exerciseLookup[entry.exercise_id];
                return (
                  <tr
                    id={entry.exercise_entry_id}
                    key={entry.exercise_entry_id}
                    action
                  >
                  {editingTable ?
                    <td>
                      <Button variant="outline-dark" size="sm"> 🗑️ </Button>
                    </td>
                  :
                    <div></div>
                  }
                    <td className="log-column-1">
                      <Button variant="outline-dark" size="sm" onClick={() => openEntryModal("delete", entry, exerciseLookup[entry.exercise_id])}> 🗑️ </Button>
                    </td>
                    <td className="log-column-2">
                    {editingTable ?
                      <Form.Control
                        as="input"
                        type="date"
                        value={new Date(entry.timestamp).toISOString().slice(0, 10)}
                      />
                    :
                      new Date(entry.timestamp).toLocaleDateString()
                    }
                    </td>
                    <td className="log-column-3">
                    {exercise === undefined ?
                      ""
                    :
                      exercise.name + " | " + exercise.category + " | " + exercise.sets + " x " + exercise.reps + " @ " + exercise.amount + " " + exercise.units
                    }
                    </td>
                    <td className="log-column-4">
                    {editingTable ?
                      <Form.Control
                        as="textarea"
                        rows="2"
                        value={entry.notes}
                      />
                    :
                      entry.notes
                    }
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          }
        </Tab>
        <Tab eventKey="insights" title="Insights 📈">
        </Tab>
      </Tabs>
      <br/>
    </Container>
  );
}

export default Exercise;
