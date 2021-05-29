import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Tabs, Tab, Card, Alert } from 'react-bootstrap';

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
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalExercise, setModalExercise] = useState();

  useEffect(() => {
    getExercises();
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

  const openAddModal = () => {
    setAddShow(true);
    setModalHeader("Add Exercise");
    setModalExercise(Object.assign({}, MODEL.exercise));
  }

  const closeAddModal = () => {
    setAddShow(false);
    setModalHeader("");
    setModalExercise();
  }

  if(isFatal) {
    return (
      <FatalError
        errorMsg={fatalMsg}
      />
    );
  }
  if(exercises === undefined) {
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
        show={addShow ? addShow : editShow ? editShow : false}
        header={modalHeader}
        exercise={modalExercise}
        onClose={closeAddModal}
      />
      <Row>
        <Col xs={10}>
          <h3> Exercises 💪 </h3>
        </Col>
        <Col xs={2} className="add-button-align">
          <Button variant="outline-info" onClick={openAddModal}> + </Button>
        </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="saved">
        <Tab eventKey="saved" title="Saved">
          <br/>
          <Row>
          {exercises.map((exercise) => {
            return (
              <Col lg={4} key={exercise.exercise_id}>
                <Card
                  bg="light"
                  text="dark"
                >
                  <Card.Header>
                    {exercise.name}
                    <Button size="sm" variant="outline-dark" className="exercise-card-buttons"> 🗑️ </Button>
                    <Button size="sm" variant="outline-dark" className="exercise-card-buttons"> ✏️ </Button>
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
        </Tab>
        <Tab eventKey="logs" title="Logs">
        </Tab>
        <Tab eventKey="insights" title="Insights">
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Exercise;
