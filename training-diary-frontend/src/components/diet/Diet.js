import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';

import Insights from '../generic/Insights.js';
import EntryLogs from '../generic/EntryLogs.js';
import FatalError from '../generic/FatalError.js';

const LOCAL_STORAGE = require('../../util/localStorageHelper.js');
const CONTROLLER = require('../../controllers/dietController.js');


const Diet = (props) => {
  const [isFatal, setIsFatal] = useState(false);
  const [fatalMsg, setFatalMsg] = useState("");
  const [entries, setEntries] = useState();

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
        setEntries(res.data.data);
      }
    };
    const callbackOnError = (error) => {
      setIsFatal(true);
      setFatalMsg(error.response.data.message);
    };
    CONTROLLER.getDietEntries(token, user_id, callback, callbackOnError);
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
      <Row>
      <Col xs={10}>
        <h3> Diet 🍽️ </h3>
      </Col>
      <Col xs={2} className="right-align">
        <Button variant="outline-dark"> + </Button>
      </Col>
      </Row>
      <br/>
      <Tabs defaultActiveKey="logs">
        <Tab eventKey="logs" title="Logs 📝">

        </Tab>
        <Tab eventKey="insights" title="Insights 📈">
          <br/>
          <Insights
            model={"diet"}
            entries={[]}
            exerciseLookup={undefined}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Diet;
