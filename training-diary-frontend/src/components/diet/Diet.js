import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';

import DietModal from './DietModal.js';
import Insights from '../generic/Insights.js';
import EntryLogs from '../generic/EntryLogs.js';
import FatalError from '../generic/FatalError.js';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const CONTROLLER = require('../../controllers/dietController.js');
const MODEL = require('../../models/diet.js');


const Diet = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [entries, setEntries] = useState();
  const [addShow, setAddShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalDiet, setModalDiet] = useState();
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    getDiet();
  }, [])

  const getDiet = () => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var temp = res.data.data;
        // sort descending by timestamp
        temp.sort((ele1, ele2) => {
          return ele2.timestamp - ele1.timestamp;
        });
        setEntries(temp);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getDietEntries(token, user_id, callback, callbackOnError);
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
        var copy = entries.slice();
        copy.push(res.data.data);
        setEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.createDiet(token, user_id, diet, callback, callbackOnError);
  }

  const openAddModal = () => {
    var diet = Object.assign({}, MODEL.diet);
    setModalDiet(diet);
    setAddShow(true);
    setModalHeader("Add Diet");
    setModalType("add");
  }

  const onCloseAddModal = () => {
    setAddShow(false);
    setModalDiet();
    setModalHeader("");
    setModalType("");
  }

  const calculateTableData = () => {
    if(entries === undefined) {
      return [];
    }
    var rows = [];
    for(var i = 0; i < entries.length; i++) {
      var row = {};
      var data = [];
      var entry = entries[i];
      for(var n = 0; n < MODEL.metaData.length; n++) {
        if(MODEL.metaData[n].required) {
          var key = MODEL.metaData[n].value;
          data.push({key: key, value: entry[key]});
        }
      }
      // push notes, since it's not required but it should be shown
      data.push({key: "notes", value: entry.notes});
      row.entry = entry;
      row.data = data;
      rows.push(row);
    }
    return rows;
  }

  const sortEntriesAscending = () => {
    var copy = entries.slice();
    copy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    setEntries(copy);
  }

  const sortEntriesDescending = () => {
    var copy = entries.slice();
    copy.sort((ele1, ele2) => {
      return ele2.timestamp - ele1.timestamp;
    });
    setEntries(copy);
  }

  if(isFatal) {
    return (
      <FatalError
        errorMsg={fatalMsg}
      />
    );
  }
  return (
    <Container>
      <DietModal
        show={addShow}
        header={modalHeader}
        diet={modalDiet}
        type={modalType}
        onSubmitModal={createDiet}
        onClose={onCloseAddModal}
      />
      <Row>
      <Col xs={10}>
        <h3> Diet 🍽️ </h3>
      </Col>
      <Col xs={2} className="right-align">
        <Button variant="outline-dark" onClick={openAddModal}> + </Button>
      </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="logs">
        <Tab eventKey="logs" title="Logs 📝">
          <br/>
          <EntryLogs
            columns={["Date", "Calories", "Proteins", "Fats", "Carbs", "Notes"]}
            rows={calculateTableData()}
            sortRecent={sortEntriesDescending}
            sortOldest={sortEntriesAscending}
          />
        </Tab>
        <Tab eventKey="insights" title="Insights 📈">
          <br/>
          <Insights
            model={"diet"}
            entries={entries}
            exerciseLookup={undefined}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Diet;
