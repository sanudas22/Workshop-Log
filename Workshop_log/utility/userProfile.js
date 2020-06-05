var connectionDB = require('./../utility/connectionDB');
var userModel = require('../models/user');
var userConnectionModel = require('../models/userconnection');
var mongoose = require('mongoose');
var careerBuilderDB = 'mongodb://localhost/careerBuilderDB';
var Schema = mongoose.Schema;
mongoose.connect(careerBuilderDB, { useNewUrlParser: true, useUnifiedTopology: true });

//model
var userProfileModel = mongoose.model('userConnection', new Schema({
    userID: String,
    connectionId: String,
    category: String,
    name: String,
    rsvp: String
}));

class userProfile {
  constructor(user_id,conn_list){
    this.user_id = user_id;
    this.conn_list = conn_list;
  }
  // set Conn_list(conn_list) {
  //   this.conn_list = conn_list;
  // }
}

//Add a new connection
var addConnection = async function(connectionId,userId, action) {
  var conn = await connectionDB.getConnection(connectionId);
  var userConnection = new userProfileModel({
    userID: userId,
    connectionId: conn.workshopId,
    category: conn.topic,
    name: conn.name,
    rsvp: action
  });
  await userConnection.save();
  return userConnection;
}

//Delete an user connectiom
var removeConnection = async function(connectionID) {
  console.log(connectionID);
  userProfileModel.remove({connectionId: connectionID}, function(err) {
        if (err) return handleError(err);
    });
}

//Update RSVP of an existing user connections
var updateRSVP = async function(userId, connectionId, action) {
  await userProfileModel.findOneAndUpdate({
    userID: userId,
    connectionId: connectionId
  }, {
     $set: { rsvp: action } }).exec().then((userconnection) => {

    }).catch((err) => {
        console.log(err);
    });
}

//Get the list of user connections for a given userId
var getUserConnectionsForID = async function(userId) {
    var userConnections = [];
    await userProfileModel.find({userID: userId}).exec().then((connections) => {
      connections.forEach((item, index) => {
        userConnection = new userConnectionModel.userconnection(item.userID, item.connectionId, item.category, item.name, item.rsvp);
        userConnections.push(userConnection);
      });
    }).catch((err) => {
        console.log(err);
    });
    return userConnections;
}

module.exports.getUserConnections = function(userConnectionList) {
  result = [];
  if (userConnectionList === undefined) {
    return result;
  }
  for (var i = 0; i < userConnectionList.length; i++) {
    conn = userConnectionList[i];
  //  var temp = get_conn_data(conn.connection);
  var userConnection = new userConnectionModel.userconnection(conn.userId, conn.connectionId, conn.category, conn.name, conn.rsvp );
  result.push(userConnection);
  }
  return result;

};

module.exports.clear_session = function() {
  user_session = null;
};

module.exports.userProfile = userProfileModel;
module.exports.addConnection = addConnection;
module.exports.removeConnection = removeConnection;
module.exports.getUserConnectionsForID = getUserConnectionsForID;
module.exports.updateRSVP = updateRSVP;
