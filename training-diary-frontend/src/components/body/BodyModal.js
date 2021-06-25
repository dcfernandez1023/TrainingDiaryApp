import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const MODEL = require('../../models/body.js');


/*
   Props:
    * show
    * header
    * body
    * type
    * model
    * onClose
    * onSubmitModal
*/
const BodyModal = (props) => {
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [body, setBody] = useState();
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    setShow(props.show);
    setHeader(props.header);
    setBody(props.body);
    setType(props.type);
    setModel(props.model);
  }, [props.show, props.header, props.body, props.type]);

  const closeModal = () => {
    setValidated(false);
    setShowSpinner(false);
    setSubmitDisabled(false);
    props.onClose();
  }

  const onChangeInput = (e) => {
    setValidated(false);
    var name = e.target.name;
    var value = e.target.value;
    var copy = Object.assign({}, body);
    copy[name] = value;
    setBody(copy);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);
    if(body.timestamp === 0 || body.timestamp === null) {
      return;
    }
    // ensure data types
    var copy = Object.assign({}, body);
    // get date
    if(type === "add") {
      var dateObj = new Date(body.timestamp);
      copy.timestamp = dateObj.getTime();
      copy.day = dateObj.getDate() + 1;
      copy.month = dateObj.getMonth() + 1;
      copy.year = dateObj.getFullYear();
    }
    for(var i = 0; i < MODEL.bodyFatMetaData.length; i++) {
      var field = MODEL.bodyFatMetaData[i];
      if(copy[field.value].toString().trim().length == 0 && field.required && type !== "delete") {
        return;
      }
      if(field.type === "number") {
        copy[field.value] = parseInt(copy[field.value]);
      }
    }
    setShowSpinner(true);
    setSubmitDisabled(true);
    props.onSubmitModal(copy, closeModal);
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Modal.Body>
        {model === "bodyFat" && body !== undefined ?
          <Row>
            <Col md={6} className="column-spacing">
              <Form.Label> Date </Form.Label>
              <DatePicker
                className="customDatePickerWidth"
                placeholderText="Click to select a date"
                selected={body === undefined || body.timestamp == 0 ? null : new Date(body.timestamp)}
                customInput={
                  <Form.Control
                    as="input"
                    required
                  />
                }
                required
                onChange={(date) => {
                  setValidated(false);
                  var copy = Object.assign({}, body);
                  copy.timestamp = date.getTime();
                  setBody(copy);
                }}
              />
            </Col>
            {MODEL.bodyFatMetaData.map((field) => {
              if(field.element === "input" || field.element === "textarea") {
                return (
                  <Col md={field.colSpace} className="column-spacing">
                    <Form.Label> {field.display} </Form.Label>
                    <Form.Control
                      as={field.element}
                      type={field.type === "number" ? "number" : "text"}
                      name={field.value}
                      value={body[field.value]}
                      rows={field.element === "textarea" ? 4 : undefined}
                      onChange={onChangeInput}
                    />
                  </Col>
                );
              }
              else if(field.element === "select") {
                return (
                  <Col md={field.column} className="column-spacing">
                      <Form.Control
                        as={field.element}
                        type={field.type === "number" ? "number" : "text"}
                        name={field.value}
                        value={body[field.value]}
                        onChange={onChangeInput}
                      >
                        <option value="" selected> Select </option>
                        {field.options.map((option) => {
                          return (
                            <option value={option}> {option} </option>
                          );
                        })}
                      </Form.Control>
                  </Col>
                );
              }
            })}
          </Row>
          :
          <div></div>
        }
        </Modal.Body>
        <Modal.Footer>
        {showSpinner ?
          <Spinner animation="border" variant="primary" />
        :
          <div></div>
        }
        {type === "delete" ?
          <Button type="submit" variant="danger" disabled={submitDisabled}> Delete </Button>
        :
          <Button type="submit" variant="info" disabled={submitDisabled}> Done </Button>
        }
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BodyModal;
