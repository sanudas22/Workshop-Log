var connectionModel = require('../models/connection');
var userProfileModel = require('./../utility/userProfile');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var careerBuilderDB = 'mongodb://localhost/careerBuilderDB';
//var random = require('random-int');
const random = require('random');

mongoose.connect(careerBuilderDB, { useNewUrlParser: true, useUnifiedTopology: true });

//model
var connectionDBModel = mongoose.model('Connection', new Schema({
    workshopId: String,
    topic: String,
    name: String,
    details: String,
    venue: String,
    date: String,
    time: String
}));

var currentDate = function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + dd + '-' + mm;
  return today;
}

var ids = async function() {
  var existingIds = [];
   await connectionDBModel.find({}).exec().then((conData) => {
    conData.forEach((item, index) => {
      existingIds.push(item.workshopId);
    });
  }).catch((err) => {
    console.log(err);
  });
  return existingIds;
};

var categoryTopics = async function() {
  var topics = [];

   await connectionDBModel.find({}).exec().then((conData) => {
    // console.log(conData);
    conData.forEach((item, index) => {

      if(!topics.includes(item.topic)) {
        topics.push(item.topic);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
  return topics;
};

var getConnections = async function() {
  var connections = [];
  var connection;
   await connectionDBModel.find({}).exec().then((conData) => {
    conData.forEach((item, index) => {
      connection = new connectionModel.connection(item.workshopId, item.topic, item.name, item.details, item.venue, item.date, item.time);
      connections.push(connection);
    });
  }).catch((err) => {
      console.log(err);
  });

  return connections;
};

var getConnection = async function(id) {
  var connection;
  //var connId = String(id);
       await connectionDBModel.findOne({workshopId: id}).exec().then((item) => {
          connection = new connectionModel.connection(item.workshopId, item.topic, item.name, item.details, item.venue, item.date, item.time);
      }).catch((err) => {
          console.log(err);
      });

    return connection;
};

//Start a new connection
var addNewConnection = async function(connection, userId) {
  var id = random.int(0, 500);;
    var newConnection = new connectionDBModel({
        workshopId: id,
        topic: connection.topic,
        name: connection.name,
        details: connection.details,
        venue: connection.venue,
        date: connection.date,
        time: connection.time
    });
    await newConnection.save();
    await userProfileModel.addConnection(id,userId,"Yes");
}

module.exports.currentDate = currentDate;
module.exports.categoryTopics = categoryTopics;
module.exports.ids = ids;
module.exports.getConnection = getConnection;
module.exports.getConnections = getConnections;
module.exports.addNewConnection = addNewConnection;
module.exports.connectionDB = connectionDBModel;
