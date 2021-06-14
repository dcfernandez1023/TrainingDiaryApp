import React, { useState, useEffect } from 'react';

import { Row, Col, Button, Form, ListGroup, Card, Table } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
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

  const calculateDietAverages = () => {
    if(props.entries === undefined || props.entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return {};
    }
    var averages = {calories: 0, proteins: 0, carbs: 0, fats: 0};
    for(var i = 0; i < props.entries.length; i++) {
      var entry = props.entries[i];
      averages.calories += entry.calories;
      averages.proteins += entry.protein;
      averages.carbs += entry.carbs;
      averages.fats += entry.fat;
    }
    averages.calories = Math.round(averages.calories / props.entries.length);
    averages.proteins = Math.round(averages.proteins / props.entries.length);
    averages.carbs = Math.round(averages.carbs / props.entries.length);
    averages.fats = Math.round(averages.fats / props.entries.length);
    return averages;
  }

  const calculateMinAndMaxDiet = () => {
    if(props.entries === undefined || props.entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return {};
    }
    var maxes = {calories: 0, proteins: 0, carbs: 0, fats: 0};
    var mins = {
      calories: Number.MAX_SAFE_INTEGER,
      proteins: Number.MAX_SAFE_INTEGER,
      carbs: Number.MAX_SAFE_INTEGER,
      fats: Number.MAX_SAFE_INTEGER
    };
    for(var i = 0; i < props.entries.length; i++) {
      var entry = props.entries[i];
      // calories
      if(entry.calories > maxes.calories) {
        maxes.calories = entry.calories;
      }
      if(entry.calories < mins.calories) {
        mins.calories = entry.calories;
      }
      // proteins
      if(entry.protein > maxes.proteins) {
        maxes.proteins = entry.protein;
      }
      if(entry.protein < mins.proteins) {
        mins.proteins = entry.protein;
      }
      // carbs
      if(entry.carbs > maxes.carbs) {
        maxes.carbs = entry.carbs;
      }
      if(entry.carbs < mins.carbs) {
        mins.carbs = entry.carbs;
      }
      // fats
      if(entry.fat > maxes.fats) {
        maxes.fats = entry.fat;
      }
      if(entry.fat < mins.fats) {
        mins.fats = entry.fat;
      }
    }
    return {mins: mins, maxes: maxes};
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
  else if(props.model === "diet") {
    var averages = calculateDietAverages();
    var minsAndMaxes = calculateMinAndMaxDiet();
    var mins = minsAndMaxes.mins;
    var maxes = minsAndMaxes.maxes;
    console.log(minsAndMaxes);
    return (
      <div>
        <Row>
          <Col>
            Select
          </Col>
        </Row>
        <br/>
        <Row>
          <Col lg={4}>
            <Card className="card-spacing">
              <Card.Header>
                Avg. Calories and Macronutrients
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item> <strong>Calories:</strong> {averages.calories} </ListGroup.Item>
                  <ListGroup.Item> <strong>Proteins:</strong> {averages.proteins}g </ListGroup.Item>
                  <ListGroup.Item> <strong>Carbs:</strong> {averages.carbs}g </ListGroup.Item>
                  <ListGroup.Item> <strong>Fats:</strong> {averages.fats}g </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <Card className="card-spacing">
              <Card.Header> Min/Max Calories and Macronutrients </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item> <strong>Calories:</strong> {maxes.calories} (max) | {mins.calories} (min) {averages.calories} </ListGroup.Item>
                  <ListGroup.Item> <strong>Proteins:</strong> {averages.proteins}g </ListGroup.Item>
                  <ListGroup.Item> <strong>Carbs:</strong> {averages.carbs}g </ListGroup.Item>
                  <ListGroup.Item> <strong>Fats:</strong> {averages.fats}g </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="card-equal-height">
              <Card.Header> Calorie and Macronutrient Graph </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  else {
    return (
      <h5> Could not generate insights - No such type {props.model === undefined || props.model === null ? "undefined" : props.model.toString()} </h5>
    );
  }
}

export default Insights;
