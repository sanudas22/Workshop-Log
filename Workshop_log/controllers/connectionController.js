var connectionDB = require('./../utility/connectionDB');
var express = require('express');
var router = express.Router();
var userconnectionModel = require('./../models/userconnection');
var { check, validationResult } = require('express-validator');
Connection = require('../models/connection');
var currentDate = connectionDB.currentDate();
var regExp = /^[A-Za-z0-9]+$/;

router.post('/connections',
 [
  check('topic').isAlphanumeric().withMessage('Workshop Category: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('name').isAlphanumeric().withMessage('Name: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('details').trim()
    .escape(),
  check('venue').isAlphanumeric().withMessage('Workshop Venue: Only Alphanumeric characters allowed.').trim()
    .escape(),
  check('date').isAfter(new Date().toDateString()).withMessage('Date: Only future dates are allowed.')
  //time
],
async function(request,response){
  var errors = validationResult(request);
  if (!errors.isEmpty()) {
    var sessionData = {
      user: request.session.user
    };
    response.render('newConnection',{sessionData: sessionData, errors:errors.array()});
  } else{
    await connectionDB.addNewConnection(request.body, request.session.user.userId);
    response.redirect('/connections');
  }
});

//Default Index
router.get('/', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('index', {sessionData: sessionData});
  } else {
    response.render('index');
  }
});



//Connection page route validating the route params and rendering pages accordingly
router.get('/connection', async function(request, response) {
    if (request.query.length === 0) {
      var sessionData = {
        categoryTopics: await connectionDB.categoryTopics(),
        connections: await connectionDB.getConnections(),
        user: request.session.user
      }
      //console.log(sessionData);
      response.render('connections', { sessionData : sessionData});
    } else if (Object.keys(request.query).length === 1) {
        if (Object.keys(request.query)[0] === 'connectionID') {
            var connectionID = request.query.connectionID;
            //connectionID format check
            if(!regExp.test(connectionID)) {
              response.status(404).send("Incorrect connection ID. Page Not found.");
            }
            var ids = await connectionDB.ids();
            //console.log(ids);
            if(ids.includes(connectionID)) {
              var connectionObj = await connectionDB.getConnection(connectionID);
              console.log(connectionObj);
              var sessionData = {
                connection: connectionObj,
                user: request.session.user
              }
              //console.log(sessionData);
              response.render('connection', { sessionData : sessionData});
            } else {
              response.status(404).send("Incorrect connection ID. Page Not found.");
            }
        } else {
          var sessionData = {
            categoryTopics: await connectionDB.categoryTopics(),
            connections: await connectionDB.getConnections(),
            user: request.session.user
          }
        // console.log(sessionData);
          response.render('connections', { sessionData : sessionData});
        }
    }
});

//Index route with session validations
router.get('/index', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('index', {sessionData: sessionData});
  } else {
    response.render('index');
  }
});

//About route with session validations
router.get('/about', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('about', {sessionData: sessionData});
  } else {
    response.render('about');
  }
});

//Contact route with session validations
router.get('/contact', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('contact', {sessionData: sessionData});
  } else {
    response.render('contact');
  }
});

//Connections/Workshops route with session validations
router.get('/connections', async function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      categoryTopics: await connectionDB.categoryTopics(),
      connections: await connectionDB.getConnections(),
      user: request.session.user
    }
   //console.log(sessionData);
    response.render('connections', {sessionData: sessionData});
  }else {
    var data = {
      categoryTopics: await connectionDB.categoryTopics(),
      connections: await connectionDB.getConnections()
    }
    response.render('connections', {sessionData: data});
  }
});

//"Start a new workshop" route with session validations
router.get('/newConnection', function(request, response) {
  if (request.session.user !== undefined) {
    var sessionData = {
      user: request.session.user
    };
    response.render('newConnection', {sessionData: sessionData, errors: null});
  } else {
    response.render('newConnection', {errors: null  });
  }
});

module.exports.clear_session = function() {
  session = null;
};

module.exports = router;
