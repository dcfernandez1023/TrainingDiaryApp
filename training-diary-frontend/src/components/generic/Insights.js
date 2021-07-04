import React, { useState, useEffect } from 'react';

import { Row, Col, Button, InputGroup, Form, ListGroup, Card, Table, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, ZAxis, CartesianGrid, PieChart, Pie, Legend, Cell, Tooltip, ResponsiveContainer,  ScatterChart,
  Scatter } from "recharts";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import '../../styles/insights.css';


/*
  Props:
    * entries
    * model - the model object to render insights for
    * exerciseLookup - to get exercises from entries in O(1)
*/
const Insights = (props) => {
  const [entries, setEntries] = useState([]);
  const [timeFilter, setTimeFilter] = useState({});

  useEffect(() => {
    setEntries(props.entries);
  }, [props.entries])

  const COLORS = [
    "ForestGreen",
    "BlueViolet",
    "Chocolate",
    "Crimson",
    "DarkSalmon",
    "DarkSeaGreen"
  ];

  const TIME_FILTERS = [
    "Last 7 Days",
    "Last Month",
    "Custom"
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

  const applyTimeFilter = (startDate, endDate) => {
    if(startDate === null || endDate === null) {
      setEntries(props.entries);
      return;
    }
    var startTime = startDate.getTime();
    var endTime = endDate.getTime();
    var filtered = [];
    for(var i = 0; i < props.entries.length; i++) {
      if(startTime <= props.entries[i].timestamp && props.entries[i].timestamp <= endTime) {
        filtered.push(props.entries[i]);
      }
    }
    setEntries(filtered);
  }

  const onChangeDateRange = (filter) => {
    if(timeFilter.name === filter) {
      setTimeFilter({});
      applyTimeFilter(null, null);
      return;
    }
    var startDate = new Date();
    var endDate = new Date();
    if(filter === "Last 7 Days") {
      startDate.setDate(startDate.getDate() - 7);
      applyTimeFilter(startDate, endDate);
    }
    else if(filter === "Last Month") {
      const month = startDate.getMonth();
      startDate.setMonth(month - 1);
      while(startDate.getMonth() === month) {
        startDate.setDate(startDate.getDate() - 1);
      }
      applyTimeFilter(startDate, endDate);
    }
    else if(filter === "Custom") {
      startDate = null;
      endDate = null;
    }
    setTimeFilter({start: startDate, end: endDate, name: filter});
  }

  const generateDietGraphData = () => {
    var data = [];
    var copy = entries.slice();
    copy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    for(var i = 0; i < copy.length; i++) {
      var entry = copy[i];
      data.push(
        {
          name: new Date(entry.timestamp).toLocaleDateString(),
          calories: entry.calories,
          proteins: entry.protein,
          carbs: entry.carbs,
          fats: entry.fat
        }
      );
    }
    return data;
  }

  const calculateMostLoggedExercises = () => {
    if(entries === undefined || entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return [];
    }
    var mostLogged = [];
    var frequencyCount = {};
    // count number of times each exercise has been logged
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
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
    if(entries === undefined || entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate most logged exercises.");
      return [];
    }
    var breakdown = [];
    var breakdownCount = {};
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if(props.exerciseLookup[entry.exercise_id] === undefined) {
        return [];
      }
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
    if(entries === undefined || entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate diet averages.");
      return {};
    }
    var averages = {calories: 0, proteins: 0, carbs: 0, fats: 0};
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      averages.calories += entry.calories;
      averages.proteins += entry.protein;
      averages.carbs += entry.carbs;
      averages.fats += entry.fat;
    }
    averages.calories = Math.round(averages.calories / entries.length);
    averages.proteins = Math.round(averages.proteins / entries.length);
    averages.carbs = Math.round(averages.carbs / entries.length);
    averages.fats = Math.round(averages.fats / entries.length);
    return averages;
  }

  const calculateMinAndMaxDiet = () => {
    if(entries === undefined || entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate min and max diet data.");
      return {};
    }
    var maxes = {calories: 0, proteins: 0, carbs: 0, fats: 0};
    var mins = {
      calories: Number.MAX_SAFE_INTEGER,
      proteins: Number.MAX_SAFE_INTEGER,
      carbs: Number.MAX_SAFE_INTEGER,
      fats: Number.MAX_SAFE_INTEGER
    };
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
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

  const calculateMinAndMaxBody = () => {
    if(entries === undefined || entries === null) {
      //TODO: handle this more elegantly
      alert("Could not calculate min and max body data.");
      return {};
    }
    var minMax = {
      minBf: Number.MAX_SAFE_INTEGER,
      minBw: Number.MAX_SAFE_INTEGER,
      maxBf: 0,
      maxBw: 0,
      avgBf: 0,
      avgBw: 0
    };
    var bfTotal = 0;
    var bwTotal = 0;
    var bfCount = 0;
    var bwCount = 0;
    for(var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      // determine mins, maxes, and avgs
      if(entry.type === "BODY_FAT") {
        if(entry.percentage < minMax.minBf) {
          minMax.minBf = entry.percentage;
        }
        else {
          minMax.maxBf = entry.percentage;
        }
        bfTotal += entry.percentage;
        bfCount++;
      }
      else if(entry.type === "BODY_WEIGHT") {
        if(entry.weight < minMax.minBw) {
          minMax.minBw = entry.weight;
        }
        else {
          minMax.maxBw = entry.weight;
        }
        bwTotal += entry.weight;
        bwCount++;
      }
    }
    minMax.avgBf = Math.round(bfTotal / bfCount);
    minMax.avgBw = Math.round(bwTotal / bwCount);
    if(isNaN(minMax.avgBf)) {
      minMax.avgBf = "None";
    }
    if(isNaN(minMax.avgBw)) {
      minMax.avgBw = "None";
    }
    if(minMax.minBf == Number.MAX_SAFE_INTEGER) {
      minMax.minBf = "None";
    }
    if(minMax.minBw == Number.MAX_SAFE_INTEGER) {
      minMax.minBw = "None";
    }
    console.log(minMax);
    return minMax;
  }

  const calculateBodyGraphData = () => {
    if(entries === null || entries === undefined) {
      return [];
    }
    var copy = entries.slice();
    copy.sort((ele1, ele2) => {
      return ele1.timestamp - ele2.timestamp;
    });
    var bfData = [];
    var bwData = [];
    for(var i = 0; i < copy.length; i++) {
      var entry = copy[i];
      if(entry.type === "BODY_FAT") {
        var dataPoint = {
          name: new Date(entry.timestamp).toLocaleDateString(),
          "body fat %": entry.percentage,
        };
        bfData.push(dataPoint);
      }
      else if(entry.type === "BODY_WEIGHT") {
        var dataPoint = {
          name: new Date(entry.timestamp).toLocaleDateString(),
          "body weight": entry.weight,
        };
        bwData.push(dataPoint);
      }
    }
    return {bfData: bfData, bwData: bwData};
  }

  if(entries === undefined) {
    return <div></div>;
  }
  if(entries.length === 0 && (timeFilter.start === null && timeFilter.end === null || Object.keys(timeFilter).length === 0)) {
    return (
      <div className="center-align"> You have no data to be analyzed </div>
    );
  }

  const timeComponents = <Row>
            <Col md={7} className="column-margin-spacing">
              {Object.keys(timeFilter).length === 0 ?
                <div> Showing data from: <Badge pills variant="dark"> All Time </Badge> </div>
                :
                <div>
                  {timeFilter.name === "Custom" ?
                  <div>
                    <span> Showing Data From: </span>
                    <DateRangePicker
                      onChange={(dates) => {
                        if(dates === null) {
                          setTimeFilter({start: null, end: null, name: "Custom"});
                          applyTimeFilter(null, null);
                        }
                        else {
                          setTimeFilter({start: dates[0], end: dates[1], name: "Custom"});
                          applyTimeFilter(dates[0], dates[1]);
                        }
                      }}
                      value={[timeFilter.start, timeFilter.end]}
                      className="diet-custom-spacing"
                    />
                  </div>
                  :
                    <div> Showing data from: <Badge pills variant="dark"> {timeFilter.name} </Badge> </div>
                  }
                </div>
              }
            </Col>
            <Col className="right-align" md={5}>
              <DropdownButton title="Date Range" variant="info">
                {TIME_FILTERS.map((filter) => {
                  return (
                    <Dropdown.Item onClick={() => {onChangeDateRange(filter)}} active={filter === timeFilter.name}> {filter} </Dropdown.Item>
                  );
                })}
              </DropdownButton>
            </Col>
          </Row>;

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
    var graphData = generateDietGraphData();
    console.log(graphData);
    var mins = minsAndMaxes.mins;
    var maxes = minsAndMaxes.maxes;
    const dataPoints = [
      {value: "calories", display: "Calories"},
      {value: "proteins", display: "Protein"},
      {value: "carbs", display: "Carbs"},
      {value: "fats", display: "Fat"}
    ];
    return (
      <div>
        {timeComponents}
        <br/>
        {entries.length === 0 && timeFilter.start !== null && timeFilter.end !== null ?
          <Row>
            <Col className="center-align">
              You have no data within the specified date range
            </Col>
          </Row>
        :
        <Row>
          <Col lg={4}>
            <Card className="card-spacing">
              <Card.Header>
                Summary
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {dataPoints.map((point) => {
                    return (
                      <ListGroup.Item>
                        <div> <strong> {point.display} </strong> </div>
                        <div className="indent"> Average: {averages[point.value]} </div>
                        <div className="indent"> Min: {mins[point.value]} </div>
                        <div className="indent"> Max: {maxes[point.value]} </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="card-equal-height">
              <Card.Header> Graph </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calories" stroke="#8884d8" />
                    <Line type="monotone" dataKey="proteins" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="carbs" stroke="#F0B27A" />
                    <Line type="monotone" dataKey="fats" stroke="#F1948A" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        }
      </div>
    );
  }
  else if(props.model === "body") {
    var minMaxAvg = calculateMinAndMaxBody();
    var graphData = calculateBodyGraphData();
    console.log(graphData);
    return (
      <div>
        {timeComponents}
        <br/>
        {entries.length === 0 && timeFilter.start !== null && timeFilter.end !== null ?
          <Row>
            <Col className="center-align">
              You have no data within the specified date range
            </Col>
          </Row>
        :
        <Row>
          <Col lg={4}>
            <Card className="card-spacing">
              <Card.Header>
                Summary
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div> <strong> Body Fat </strong> </div>
                    <div className="indent"> Average: {minMaxAvg.avgBf} </div>
                    <div className="indent"> Min: {minMaxAvg.minBf} </div>
                    <div className="indent"> Max: {minMaxAvg.maxBf} </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="indent"> <strong> Body Weight </strong> </div>
                    <div className="indent"> Average: {minMaxAvg.avgBw} </div>
                    <div className="indent"> Min: {minMaxAvg.minBw} </div>
                    <div className="indent"> Max: {minMaxAvg.maxBw} </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <div>
              <Card style={{minHeight: "300px"}} className="card-equal-height">
                <Card.Header> Graph </Card.Header>
                <Card.Body>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData.bwData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="body weight" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
                </Card.Body>
              </Card>
              <br/>
              <Card style={{minHeight: "300px"}} className="card-equal-height">
                <Card.Header> Graph </Card.Header>
                <Card.Body>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData.bfData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="body fat %" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      }
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
