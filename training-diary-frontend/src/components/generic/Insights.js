import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import { PieChart, Pie, Legend, Tooltip } from "recharts";


const Insights = (props) => {

    const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 }
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
    console.log(breakdownCount);
  }

  if(props.model === "exercise") {
    calculateExerciseCategoryBreakdown();
    return (
      <Row>
        <Col lg={6}>
          <h5> Most Logged Exercises </h5>
          {calculateMostLoggedExercises().map((element) => {
            var exercise = props.exerciseLookup[element.exercise_id];
            return (
              <div> {exercise.name} - {exercise.sets} x {exercise.reps} @ {exercise.amount} : {element.count} </div>
            );
          })}
        </Col>
        <Col lg={6}>
          <div>
            <h5> Category Breakdown </h5>
            <small> <i> From logged exercises </i> </small>
          </div>
          <div>
            <PieChart width={1000} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={data01}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
        </Col>
      </Row>
    );
  }
  else {
    return (
      <h5> Could not generate insights - No such type '{props.model === undefined || props.model === null ? "undefined" : props.model.toString()}' </h5>
    );
  }
}

export default Insights;
