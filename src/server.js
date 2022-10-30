// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// fetch
const fetch = require('node-fetch');

// create a new server application
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());


// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


// The main page of our website
//const {encode} = require('html-entities');

// ... snipped out code ...
let nextVisitorId = 1;

app.get('/', (req, res) => {
  if( req.cookies.visitorId ) {

  } else {res.cookie('visitorId', nextVisitorId++);}
  //res.cookie('visitorId', nextVisitorId++);

  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "World",
    time: req.query.time || new Date().toLocaleString(),
    diff: req.query.diff || ((Date.now().toString()) - (req.cookies.visited))/100,
    id: req.query.id || req.cookies.visitorId,
  });
  console.log(req.cookies);
});

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }

  // respond to the browser
  // variables: question, answers, category, difficulty
  var num = Math.floor(Math.random() * (4 - 0) + 0);
  var answers = []
  for( let i = 0, j = 0; i < 4; i++ ) {

    if( i == num ) {
      answers[i] = content.results[0].correct_answer
      continue
    } else {
      answers[i] = content.results[0].incorrect_answers[j]
      j++
    }

  }

  const correctAnswer = answers[num];

  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
  })

  res.render('trivia', {
    question: content.results[0].question,
    answers: answers,
    alinks: answerLinks,
    category: content.results[0].category,
    difficulty: content.results[0].difficulty,
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");