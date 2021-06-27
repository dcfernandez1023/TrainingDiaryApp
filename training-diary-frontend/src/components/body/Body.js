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
  const [sortType, setSortType] = useState("descending");
  const [modalBody, setModalBody] = useState();
  const [modalType, setModalType] = useState("");
  const [modelType, setModelType] = useState("");

  useEffect(() => {
    getBfEntries();
    getBwEntries();
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
        var temp = res.data.data;
        // sort descending by timestamp
        temp.sort((ele1, ele2) => {
          return ele2.timestamp - ele1.timestamp;
        });
        setBfEntries(temp);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getBodyFatEntries(token, user_id, callback, callbackOnError);
  }

  const getBwEntries = () => {
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
        console.log(temp);
        setBwEntries(temp);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getBodyWeightEntries(token, user_id, callback, callbackOnError);
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

  const createBwEntry = (bodyWeight, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = bwEntries.slice();
        copy.push(res.data.data);
        setBwEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.createBodyWeightEntry(token, user_id, bodyWeight, callback, callbackOnError);
  }

  const editBodyFatEntry = (bodyFat, modalCallback) => {
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
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].bf_id === res.data.data.bf_id) {
            copy[i] = res.data.data;
            break;
          }
        }
        setBfEntries(copy);
        modalCallback();
      }
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.editBodyFatEntry(token, user_id, bodyFat, callback, callbackOnError);
  }

  const editBodyWeightEntry = (bodyWeight, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = bwEntries.slice();
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].bw_id === res.data.data.bw_id) {
            copy[i] = res.data.data;
            break;
          }
        }
        setBwEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.editBodyWeightEntry(token, user_id, bodyWeight, callback, callbackOnError);
  }

  const deleteBodyFatEntry = (bf_id, modalCallback) => {
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
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].bf_id === res.data.data.bf_id) {
            copy.splice(i, 1);
            break;
          }
        }
        setBfEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.deleteBodyFatEntry(token, user_id, bf_id, callback, callbackOnError);
  }

  const deleteBodyWeightEntry = (bw_id, modalCallback) => {
    var token = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_API_TOKEN");
    var user_id = LOCAL_STORAGE.getStorageItem("TRAINING_DIARY_USER");
    if(token === null || token === undefined || user_id === null || user_id === undefined) {
      //TODO: if token cannot be pulled from localstorage, log the user out
      alert("Could not get token");
      return;
    }
    const callback = (res) => {
      if(res.status == 200) {
        var copy = bwEntries.slice();
        for(var i = 0; i < copy.length; i++) {
          if(copy[i].bw_id === res.data.data.bw_id) {
            copy.splice(i, 1);
            break;
          }
        }
        setBwEntries(copy);
      }
      modalCallback();
    };
    const callbackOnError = (error) => {
      modalCallback();
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.deleteBodyWeightEntry(token, user_id, bw_id, callback, callbackOnError);
  }

  const openModal = (type, body) => {
    if(type === "add") {
      setAddShow(true);
      if(body.type === "BODY_FAT") {
        setModalBody(Object.assign({}, MODEL.bodyFat));
        setModalHeader("Add Body Fat");
        setModelType("bodyFat");
      }
      else if(body.type === "BODY_WEIGHT") {
        setModalBody(Object.assign({}, MODEL.bodyWeight));
        setModalHeader("Add Body Weight");
        setModelType("bodyWeight");
      }
      setModalType(type);
    }
    if(type === "edit") {
      setEditShow(true);
      if(body.type === "BODY_FAT") {
        setModalHeader("Edit Body Fat");
        setModelType("bodyFat");
      }
      else if(body.type === "BODY_WEIGHT") {
        setModalHeader("Edit Body Weight");
        setModelType("bodyWeight");
      }
      setModalBody(body);
      setModalType(type);
    }
    if(type === "delete") {
      setDeleteShow(true);
      if(body.type === "BODY_FAT") {
        setModalHeader("Delete Body Fat");
        setModelType("bodyFat");
      }
      else if(body.type === "BODY_WEIGHT") {
        setModalHeader("Delete Body Weight");
        setModelType("bodyWeight");
      }
      setModalBody(body);
      setModalType(type);
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
    setSortType("ascending");
    var bfCopy = bfEntries.slice();
    var bwCopy = bwEntries.slice();
    bfCopy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    bwCopy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    setBfEntries(bfCopy);
    setBwEntries(bwCopy);
  }

  const sortEntriesDescending = () => {
    setSortType("descending");
    var bfCopy = bfEntries.slice();
    var bwCopy = bwEntries.slice();
    bfCopy.sort((ele1, ele2) => {
      return ele2.timestamp - ele1.timestamp;
    });
    bwCopy.sort((ele1, ele2) => {
      return ele2.timestamp - ele1.timestamp;
    });
    setBfEntries(bfCopy);
    setBwEntries(bwCopy);
  }

  const calculateTableData = () => {
    var rows = [];
    var i = 0;
    var j = 0;
    while(i < bfEntries.length && j < bwEntries.length) {
      var entry = null;
      if(sortType === "ascending") {
        if(bfEntries[i].timestamp < bwEntries[j].timestamp) {
          entry = bfEntries[i];
          i++;
        }
        else {
          entry = bwEntries[j];
          j++;
        }
      }
      else {
        if(bfEntries[i].timestamp > bwEntries[j].timestamp) {
          entry = bfEntries[i];
          i++;
        }
        else {
          entry = bwEntries[j];
          j++;
        }
      }
      var row = {};
      var data = [];
      if(entry.type === "BODY_FAT") {
        for(var n = 0; n < MODEL.bodyFatMetaData.length; n++) {
          if(MODEL.bodyFatMetaData[n].required) {
            var key = MODEL.bodyFatMetaData[n].value;
            if(key === "type") {
              data.push({key: key, value: "Body Fat"});
            }
            else if(key === "percentage") {
              data.push({key: key, value: entry[key] + "%"});
            }
            else {
              data.push({key: key, value: entry[key]});
            }
          }
        }
        data.push({key: "notes", value: entry.notes});
      }
      else if(entry.type === "BODY_WEIGHT") {
        data.push({key: "timestamp", value: entry.timestamp});
        data.push({key: "type", value: "Body Weight"});
        data.push({key: "weight/units", value: entry.weight + " " + entry.units});
        data.push({key: "notes", value: entry.notes});
      }
      row.entry = entry;
      row.data = data;
      rows.push(row);
    }
    while(i < bfEntries.length) {
      var entry = bfEntries[i];
      var row = {};
      var data = [];
      for(var n = 0; n < MODEL.bodyFatMetaData.length; n++) {
        if(MODEL.bodyFatMetaData[n].required) {
          var key = MODEL.bodyFatMetaData[n].value;
          if(key === "type") {
            data.push({key: key, value: "Body Fat"});
          }
          else if(key === "percentage") {
            data.push({key: key, value: entry[key] + "%"});
          }
          else {
            data.push({key: key, value: entry[key]});
          }
        }
      }
      data.push({key: "notes", value: entry.notes});
      row.entry = entry;
      row.data = data;
      rows.push(row);
      i++;
    }
    while(j < bwEntries.length) {
      var entry = bwEntries[j];
      var row = {};
      var data = [];
      data.push({key: "timestamp", value: entry.timestamp});
      data.push({key: "type", value: "Body Weight"});
      data.push({key: "weight/units", value: entry.weight + " " + entry.units});
      data.push({key: "notes", value: entry.notes});
      row.entry = entry;
      row.data = data;
      rows.push(row);
      j++;
    }
    console.log(rows);
    return rows;
  }

  if(bfEntries === undefined || bwEntries === undefined) {
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
        onSubmitModal={
          addShow && modelType === "bodyFat" ? createBfEntry
          : addShow && modelType === "bodyWeight" ? createBwEntry
          : editShow && modelType === "bodyFat" ? editBodyFatEntry
          : editShow && modelType === "bodyWeight" ? editBodyWeightEntry
          : deleteShow && modelType === "bodyFat" ? deleteBodyFatEntry
          : deleteShow && modelType === "bodyWeight" ? deleteBodyWeightEntry
          : undefined
        }
        onClose={closeModal}
      />
      <Row>
      <Col xs={10}>
        <h3> Body 🧍 </h3>
      </Col>
      <Col xs={2} className="right-align">
        <DropdownButton title="⚙️" variant="outline-dark" menuAlign="right">
          <Dropdown.Item onClick={() => {openModal("add", Object.assign({}, MODEL.bodyFat))}}> Log Body Fat </Dropdown.Item>
          <Dropdown.Item onClick={() => {openModal("add", Object.assign({}, MODEL.bodyWeight))}}> Log Body Weight </Dropdown.Item>
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
                onClickDelete={openModal}
                onClickEdit={openModal}
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
