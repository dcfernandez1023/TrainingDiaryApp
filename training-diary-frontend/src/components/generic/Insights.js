import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Form, ListGroup, Card, Table } from 'react-bootstrap';
import { PieChart, Pie, Legend, Cell, Tooltip, ResponsiveContainer } from "recharts";

import '../../styles/insights.css';


/*
  Props:
    * entries
    * model - the model object to render insights for
    * exerciseLookup - to get exercises from entries in O(1)
*/
const Insights = (props) => {
  const COLORS = [
    "ForestGreen",
    "BlueViolet",
    "Chocolate",
    "Crimson",
    "DarkSalmon",
    "DarkSeaGreen"
  ];

  const calculateMostLoggedExercises = () => {
    if(props.entries === undefined || props.entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return [];
    }
    var mostLogged = [];
    var frequencyCount = {};
    // count number of times each exercise has been logged
    for(var i = 0; i < props.entries.length; i++) {
      var entry = props.entries[i];
      if(frequencyCount[entry.exercise_id] === undefined) {
        frequencyCount[entry.exercise_id] = 1;
      }
      else {
        frequencyCount[entry.exercise_id] = frequencyCount[entry.exercise_id] + 1;
      }
    }
    // create array of logged exercise ids with their counts
    for(var key in frequencyCount) {
      var obj = {count: frequencyCount[key], exercise_id: key};
      mostLogged.push(obj);
    }
    // sort the array in ascending order
    mostLogged.sort((ele1, ele2) => {
      return ele2.count - ele1.count;
    });
    return mostLogged;
  }

  const calculateExerciseCategoryBreakdown = () => {
    if(props.entries === undefined || props.entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return [];
    }
    var breakdown = [];
    var breakdownCount = {};
    for(var i = 0; i < props.entries.length; i++) {
      var entry = props.entries[i];
      if(breakdownCount[props.exerciseLookup[entry.exercise_id].category] === undefined) {
        breakdownCount[props.exerciseLookup[entry.exercise_id].category] = 1;
      }
      else {
        breakdownCount[props.exerciseLookup[entry.exercise_id].category]++;
      }
    }
    for(var key in breakdownCount) {
      var obj = {name: key, value: breakdownCount[key]};
      breakdown.push(obj);
    }
    return breakdown;
  }

  if(props.entries === undefined) {
    return <div></div>;
  }
  if(props.entries.length === 0) {
    return (
      <div className="center-align"> You have no data to be analyzed </div>
    );
  }
  if(props.model === "exercise") {
    const listData = calculateMostLoggedExercises();
    const pieData = calculateExerciseCategoryBreakdown();
    return (
      <Row>
        <Col lg={6}>
          <Card className="card-equal-height">
            <Card.Header> Frequently Performed Exercises </Card.Header>
            <Card.Body>
              <Table>
                <thead>
                  <th> Exercise </th>
                  <th> # of Times Performed </th>
                </thead>
                <tbody>
                  {listData.map((element) => {
                    var exercise = props.exerciseLookup[element.exercise_id];
                    if(exercise === undefined) {
                      return <div></div>;
                    }
                    return (
                      <tr>
                        <td> {exercise.name} - {exercise.sets} x {exercise.reps} @ {exercise.amount} {exercise.units} </td>
                        <td className="center-align"> {element.count} </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {/*
              <ListGroup variant="flush">
              {listData.map((element) => {
                var exercise = props.exerciseLookup[element.exercise_id];
                if(exercise === undefined) {
                  return <div></div>;
                }
                return (
                  <ListGroup.Item>
                    {exercise.name} - {exercise.sets} x {exercise.reps} @ {exercise.amount} : {element.count}
                  </ListGroup.Item>
                );
              })}
              </ListGroup>
              */}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="card-equal-height">
            <Card.Header>
              Category Breakdown <small> (<i>From exercise logs</i>) </small>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{textAlign: "center"}}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={pieData}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {
                      pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]}/>
                      ))
                    }
                  </Pie>
                  <Legend verticalAlign="top"/>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
  else {
    return (
      <h5> Could not generate insights - No such type {props.model === undefined || props.model === null ? "undefined" : props.model.toString()} </h5>
    );
  }
}

export default Insights;
