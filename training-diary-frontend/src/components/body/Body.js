import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Tabs, Tab, Spinner, DropdownButton, Dropdown } from 'react-bootstrap';
import Insights from '../generic/Insights.js';
import EntryLogs from '../generic/EntryLogs.js';
import FatalError from '../generic/FatalError.js';
import BodyModal from './BodyModal.js';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const CONTROLLER = require('../../controllers/bodyController.js');
const MODEL = require('../../models/body.js');


const Body = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [bfEntries, setBfEntries] = useState();
  const [bwEntries, setBwEntries] = useState([]);
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState();
  const [modalType, setModalType] = useState("");
  const [modelType, setModelType] = useState("");

  useEffect(() => {
    getBfEntries();
  }, [])

  const getBfEntries = () => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        setBfEntries(res.data.data);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getBodyFatEntries(token, user_id, callback, callbackOnError);
  }

  const createBfEntry = (bodyFat, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = bfEntries.slice();
        copy.push(res.data.data);
        setBfEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.createBodyFatEntry(token, user_id, bodyFat, callback, callbackOnError);
  }

  const openModal = (type, model) => {
    if(type === "add") {
      setAddShow(true);
      //TODO: setModalBody
      if(model === "bodyFat") {
        setModalBody(Object.assign({}, MODEL.bodyFat));
        setModalHeader("Add Body Fat");
      }
      else if(model === "bodyWeight") {
        setModalBody(Object.assign({}, MODEL.bodyWeight));
        setModalHeader("Add Body Weight");
      }
      setModalType(type);
      setModelType(model);
    }
  }

  const closeModal = () => {
    setAddShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setModalBody();
    setModalHeader("");
    setModalType("");
  }

  const sortEntriesAscending = () => {
    var copy = bfEntries.slice();
    copy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    setBfEntries(copy);
  }

  const sortEntriesDescending = () => {
    var copy = bfEntries.slice();
    copy.sort((ele1, ele2) => {
      return ele2.timestamp - ele1.timestamp;
    });
    setBfEntries(copy);
  }

  const calculateTableData = () => {
    var rows = [];
    for(var i = 0; i < bfEntries.length; i++) {
      var entry = bfEntries[i];
      var row = {};
      var data = [];
      if(entry.type === "BODY_FAT") {
        for(var n = 0; n < MODEL.bodyFatMetaData.length; n++) {
          if(MODEL.bodyFatMetaData[n].required) {
            var key = MODEL.bodyFatMetaData[n].value;
            if(key === "type") {
              data.push({key: key, value: "Body Fat"});
            }
            else {
              data.push({key: key, value: entry[key]});
            }
          }
        }
      }
      else if(entry.type === "BODY_WEIGHT") {
        for(var n = 0; n < MODEL.bodyFatMetaData.length; n++) {
          if(MODEL.bodyFatMetaData[n].required) {
            var key = MODEL.bodyFatMetaData[n].value;
            if(key === "type") {
              data.push({key: key, value: "Body Weight"});
            }
            else {
              data.push({key: key, value: entry[key]});
            }
          }
        }
      }
      // push notes, since it's not required but it should be shown
      data.push({key: "notes", value: entry.notes});
      row.entry = entry;
      row.data = data;
      rows.push(row);
    }
    console.log(rows);
    return rows;
  }

  if(bfEntries === undefined) {
    return (
      <Row>
        <Col className="spinner-align">
          <Spinner animation="grow"/>
        </Col>
      </Row>
    );
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
      <BodyModal
        show={addShow ? addShow : editShow ? editShow : deleteShow ? deleteShow : false}
        header={modalHeader}
        body={modalBody}
        type={modalType}
        model={modelType}
        onSubmitModal={addShow ? createBfEntry : undefined}
        onClose={closeModal}
      />
      <Row>
      <Col xs={10}>
        <h3> Body 🧍 </h3>
      </Col>
      <Col xs={2} className="right-align">
        <DropdownButton title="⚙️" variant="outline-dark" menuAlign="right">
          <Dropdown.Item onClick={() => {openModal("add", "bodyFat")}}> Log Body Fat </Dropdown.Item>
          <Dropdown.Item onClick={() => {openModal("add", "bodyWeight")}}> Log Body Weight </Dropdown.Item>
        </DropdownButton>
      </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="logs">
        <Tab eventKey="logs" title="Logs 📝">
          <br/>
            {bfEntries.length === 0 ?
              <p className="center-align"> You have no body data </p>
              :
              <EntryLogs
                columns={["Date", "Type", "Percentage/Weight", "Notes"]}
                rows={calculateTableData()}
                onClickDelete={undefined}
                onClickEdit={undefined}
                sortRecent={sortEntriesDescending}
                sortOldest={sortEntriesAscending}
              />
            }
        </Tab>
        <Tab eventKey="insights" title="Insights 📈">
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Body;
