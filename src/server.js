// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

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


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");