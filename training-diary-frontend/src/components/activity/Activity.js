import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Modal, ListGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import Calendar from 'react-calendar';
import EntryModal from '../exercises/EntryModal.js';
import ExerciseModal from '../exercises/ExerciseModal.js';
import DietModal from '../diet/DietModal.js';
import FatalError from '../generic/FatalError.js';

import '../../styles/activityCalendar.css';

const EXERCISE_CONTROLLER = require('../../controllers/exerciseController.js');
const DIET_CONTROLLER = require('../../controllers/dietController.js');
const BODY_CONTROLLER = require('../../controllers/bodyController.js');
const LOCAL_STORAGE = require('../../util/localStorageHelper.js');

const DIET_MODEL = require('../../models/diet.js');
const EXERCISE_MODEL = require('../../models/exercise.js');
const EXERCISE_ENTRY_MODEL = require('../../models/exerciseEntry.js')


const Activity = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exerciseEntries, setExerciseEntries] = useState();
  const [exercises, setExercises] = useState();
  const [exerciseLookup, setExerciseLookup] = useState();
  const [dietEntries, setDietEntries] = useState();
  const [bfEntries, setBfEntries] = useState();
  const [bwEntries, setBwEntries] = useState();
  const [drilldownData, setDrilldownData] = useState([]);
  const [isDrilldown, setIsDrilldown] = useState(false);

  const [showExerciseEntryModal, setShowExerciseEntryModal] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showDiet, setShowDiet] = useState(false);

  const [modalHeader, setModalHeader] = useState("");
  const [model, setModel] = useState();
  const [modalExercise, setModalExercise] = useState();
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    getTrainingData();
  }, []);

  const openDietModal = (type, diet) => {
    setShowDiet(true);
    setModalHeader("Log Diet");
    setModel(diet);
    setModalType(type);
  }

  const openExerciseModal = () => {
    setShowExercise(true);
    setModalHeader("Add Exercise");
    setModalType("add");
    setModel(Object.assign({}, EXERCISE_MODEL.exercise));
  }

  const openExerciseEntryModal = (type, entry) => {
    setShowExerciseEntryModal(true);
    if(type === "delete") {
      setModalHeader("Delete Log");
      setModalType(type);
      setModel(entry);
      setModalExercise(exerciseLookup[entry.exercise_id]);
    }
    else if(type === "edit") {
      setModalHeader("Edit Log");
      setModalType(type);
      setModel(entry);
      setModalExercise(exerciseLookup[entry.exercise_id]);
    }
    else {
      setModalHeader("Log Exercise");
    }
  }

  const closeModals = () => {
    setShowExerciseEntryModal(false);
    setShowDiet(false);

    setModalHeader("");
    setModel();
    setModalType("");
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
    EXERCISE_CONTROLLER.createExercise(token, user_id, newExercise, callback, callbackOnError);
  }

  const deleteExercise = () => {
    return;
  }

  const editExercise = () => {
    return;
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
        var copy = exerciseEntries.slice();
        for(var i = 0; i < res.data.data.length; i++) {
          var entry = res.data.data[i];
          copy.push(entry);
        }
        // sort descending by timestamp
        copy.sort((ele1, ele2) => {
          return ele2.timestamp - ele1.timestamp;
        });
        setExerciseEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    console.log(newEntries);
    EXERCISE_CONTROLLER.createEntries(token, user_id, newEntries, callback, callbackOnError);
  }

  const deleteEntry = () => {
    return;
  }

  const editEntry = () => {
    return;
  }

  const createDiet = (diet, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var isUpdate = false;
        var copy = dietEntries.slice();
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].diet_id === res.data.data.diet_id) {
            copy[i] = res.data.data;
            isUpdate = true;
            break;
          }
        }
        if(!isUpdate) {
          copy.push(res.data.data);
        }
        // sort descending by timestamp
        copy.sort((ele1, ele2) => {
          return ele2.timestamp - ele1.timestamp;
        });
        setDietEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    DIET_CONTROLLER.createDiet(token, user_id, diet, callback, callbackOnError);
  }

  const getTrainingData = () => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const exerciseCallback = (res) => {
      if(res.status == 200) {
        setExerciseEntries(res.data.data);
      }
    }
    const dietCallback = (res) => {
      if(res.status == 200) {
        setDietEntries(res.data.data);
      }
    }
    const bfCallback = (res) => {
      if(res.status == 200) {
        setBfEntries(res.data.data);
      }
    }
    const bwCallback = (res) => {
      if(res.status == 200) {
        setBwEntries(res.data.data);
      }
    }
    const getExercisesCallback = (res) => {
      if(res.status == 200) {
        setExercises(res.data.data);
        generateExerciseLookup(res.data.data);
      }
    }
    const callbackOnError = (error) => {
      // TODO: handle this more elegantly
      alert(error);
    }
    EXERCISE_CONTROLLER.getExercises(token, user_id, getExercisesCallback, callbackOnError);
    EXERCISE_CONTROLLER.getEntries(token, user_id, exerciseCallback, callbackOnError);
    DIET_CONTROLLER.getDietEntries(token, user_id, dietCallback, callbackOnError);
    BODY_CONTROLLER.getBodyFatEntries(token, user_id, bfCallback, callbackOnError);
    BODY_CONTROLLER.getBodyWeightEntries(token, user_id, bwCallback, callbackOnError);
  }

  const generateExerciseLookup = (exercises) => {
    var lookup = {};
    for(var i = 0; i < exercises.length; i++) {
      var exercise = exercises[i];
      lookup[exercise.exercise_id] = exercise;
    }
    setExerciseLookup(lookup);
  }

  const onChangeDate = (date) => {
    setSelectedDate(date);
  }

  const showTileContent = (date) => {
    date = date.date;
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var tileContent = ""
    for(var i = 0; i < exerciseEntries.length; i++) {
      var entry = exerciseEntries[i];
      // console.log(entry.day + " = " + day + " | " + entry.month + " = " + month + " | " + entry.year + " = " + year);
      if(entry.timestamp == date.getTime() && !tileContent.includes("💪")) {
         tileContent += "💪";
      }
      // if(entry.day == day && entry.month == month && entry.year == year && !tileContent.includes("💪")) {
      //   tileContent += "💪";
      // }
    }
    for(var i = 0; i < dietEntries.length; i++) {
      var entry = dietEntries[i];
      if(entry.timestamp == date.getTime() && !tileContent.includes("🍽️")) {
        tileContent += "🍽️";
      }
      // if(entry.day == day && entry.month == month && entry.year == year && !tileContent.includes("🍽️")) {
      //   tileContent += "🍽️";
      // }
    }
    for(var i = 0; i < bfEntries.length; i++) {
      if(bfEntries[i].timestamp == date.getTime()) {
        tileContent += "🧍";
      }
    }
    for(var i = 0; i < bwEntries.length; i++) {
      if(bwEntries[i].timestamp == date.getTime()) {
        if(!tileContent.includes("🧍")) {
          tileContent += "🧍";
        }
      }
    }
    return <div>{tileContent}</div>;
  }

  const toggleDayDrilldown = (value, e) => {
    var data = [];
    for(var i = 0; i < exerciseEntries.length; i++) {
      if(exerciseEntries[i].timestamp == value.getTime()) {
        data.push(exerciseEntries[i]);
      }
    }
    for(var i = 0; i < dietEntries.length; i++) {
      if(dietEntries[i].timestamp == value.getTime()) {
        data.push(dietEntries[i]);
      }
    }
    for(var i = 0; i < bfEntries.length; i++) {
      if(bfEntries[i].timestamp == value.getTime()) {
        data.push(bfEntries[i]);
      }
    }
    for(var i = 0; i < bwEntries.length; i++) {
      if(bwEntries[i].timestamp == value.getTime()) {
        data.push(bwEntries[i]);
      }
    }
    setDrilldownData(data);
    setIsDrilldown(true);
  }

  const parseEntryData = (entry) => {
    if(entry.exercise_entry_id !== undefined) {
      var exercise = exerciseLookup[entry.exercise_id];
      return exercise.name + " " + exercise.sets + "x" + exercise.reps + " @ " + exercise.amount;
    }
    if(entry.diet_id !== undefined) {
      return "Calories: " + entry.calories + " | Protein: " + entry.protein + " | Carbs: " + entry.carbs + " | Fats: " + entry.fat;
    }
    if(entry.bf_id !== undefined) {
      return "Body Fat: " + entry.percentage + "%";
    }
    if(entry.bw_id !== undefined) {
      return "Body Weight: " + entry.weight + " " + entry.units;
    }
  }

  if(isFatal) {
    return (
      <FatalError
        errorMsg={fatalMsg}
      />
    );
  }
  if(exerciseLookup === undefined || exerciseEntries === undefined || dietEntries === undefined || bfEntries === undefined || bwEntries === undefined) {
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
      <Modal
        show={isDrilldown}
        backdrop="static"
        onHide={() => {
          setIsDrilldown(false);
          setDrilldownData([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title> Activity on {selectedDate.toLocaleDateString()} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {drilldownData.length === 0 ?
            <p> You have no activity on this day. </p>
          :
          <ListGroup>
            {drilldownData.map((data) => {
              return (
                <ListGroup.Item>
                  {parseEntryData(data)}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          }
        </Modal.Body>
      </Modal>
      <DietModal
        show={showDiet}
        header={modalHeader}
        diet={model}
        type={modalType}
        onClose={closeModals}
        onSubmitModal={createDiet}
      />
      <EntryModal
        show={showExerciseEntryModal}
        exercises={exercises}
        header={modalHeader}
        type={modalType}
        entry={model}
        exercise={modalExercise}  
        onClose={closeModals}
        onSubmitModal={modalType === "delete" ? deleteEntry : modalType === "edit" ? editEntry : createEntries}
        createNew={openExerciseModal}
      />
      <ExerciseModal
        show={showExercise}
        header={modalHeader}
        exercise={modalExercise}
        onClose={() => {
          setShowExercise(false);
          setModalExercise();
        }}
        onSubmitModal={modalType === "delete" ? deleteExercise : modalType === "edit" ? editExercise : createExercise}
        type={modalType}
      />
      <Row>
        <Col xs={8}>
          <h4> Activity </h4>
        </Col>
        <Col xs={4} className="right-align">
          <DropdownButton title="⚙️" variant="outline-dark" menu-Align="right">
            <Dropdown.Item onClick={() => {openExerciseEntryModal("add", undefined)}}> Log Exercise </Dropdown.Item>
            <Dropdown.Item onClick={() => {openDietModal("add", Object.assign({}, DIET_MODEL.diet))}}> Log Diet </Dropdown.Item>
            <Dropdown.Item> Log Body Fat </Dropdown.Item>
            <Dropdown.Item> Log Body Weight </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col>
          <Calendar
            onChange={onChangeDate}
            value={selectedDate}
            tileContent={showTileContent}
            onClickDay={toggleDayDrilldown}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Activity;
