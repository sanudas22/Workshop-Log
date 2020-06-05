var connectionDB = require('./../utility/connectionDB');
var express = require('express');
var router = express.Router();
var userconnectionModel = require('./../models/userconnection');
Connection = require('../models/connection');
var userProfileModel = require('./../utility/userProfile');
var userConnectionModel = require('../models/userconnection');
var regExp = /^[A-Za-z0-9]+$/;

//UserConnections Route to render savedConnections page. Also handles the validations and implementations for Update and Delete actions
router.get('/', async function(req, res, next) {
  if (req.session.user == null || req.session.user == undefined) {
    res.redirect('/');
  } else {
    if(typeof req.query.id == "undefined" && typeof req.query.action == "undefined"){
      //userconnections = userProfileModel.getUserConnections(req.session.userconnections);
      //req.session.user.userItems=userconnections;
      req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
      //console.log(req.session.userconnections);
      var sessionData = {
        userconnections: req.session.userconnections,
        user: req.session.user
      };
      res.render('savedConnections', {sessionData: sessionData});
    }else if (typeof req.query.id != "undefined" && typeof req.query.action != "undefined") {
      req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
      userId = req.session.user.userId;
      connectionId = req.query.id;
      action = req.query.action;
      console.log(req.session.userconnections);
      var flag=0
      for (var i=0;i<req.session.userconnections.length;i++){
        if(req.session.userconnections[i].connectionId==connectionId){
          flag=flag+1;
        }
      }
      if(flag>0){
        for (var i=0;i<req.session.userconnections.length;i++){
          if(req.session.userconnections[i].connectionId==connectionId){
            if(!regExp.test(connectionId)) {
              response.status(404).send("Incorrect connection ID. Page Not found.");
            }
            await userProfileModel.updateRSVP(userId, connectionId, action);
            //req.session.userconnections[i].rsvp=action;
          }
        }
      }else if (flag==0) {
       await userProfileModel.addConnection(connectionId,userId,action);
      }
      req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
      var sessionData = { userconnections: req.session.userconnections, user: req.session.user};
      //console.log(sessionData);
      res.render('savedConnections', {sessionData: sessionData});
    } else if (typeof req.query.delete != "undefined" && typeof req.query.id != "undefined") {
      for(var i=0;i<req.session.userconnections.length;i++){
        if(req.session.userconnections[i].connectionId==req.query.delete ){
          if(!regExp.test(req.session.userconnections[i].connectionId)) {
            response.status(404).send("Incorrect connection ID. Page Not found.");
          }
          await userProfileModel.removeConnection(req.session.userconnections[i].connectionId);
          break;
        }
       }
       req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
       var sessionData = {userconnections: req.session.userconnections , user: req.session.user };
       res.render('savedConnections', {sessionData: sessionData});
    }
    url = req.protocol + "://" + req.get('host') + req.originalUrl;
  }
});

module.exports = router;
