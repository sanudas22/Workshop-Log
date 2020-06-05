var express = require('express');
var userProfileModel = require('./../utility/userProfile');
var UserDB = require('./../utility/UserDB');
var router = express.Router();
var { check, validationResult } = require('express-validator');
var { sanitizer } = require('express-validator');
var passwordValidator = require('password-validator');
var validatePassword = new passwordValidator();

//Login route -- post
router.post('/',
 [check('email').isEmail().normalizeEmail().withMessage('Please enter a valid Username'),
  check('password')
  // .isEmpty().withMessage('Please enter a valid password')
  // .custom(value => {
  //    return value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
  //  }).withMessage("Password should be of minimum 6 & maximum 20 characters. Password must include atleast one lowercase character, one uppercase character and one numeric character.")

  .isLength({
    min:8,
    max:15
  }).withMessage("Password should be of minimum 8 & maximum 15 characters").custom(value => {
    return value.match(/^(?!.* )(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)
  }).withMessage("Password must include atleast one lowercase character, one uppercase character and one numeric character.").trim()
    .escape()
 ],
 async function(req, res, next) {
   var errors = validationResult(req);
   if (!errors.isEmpty()) {
     res.render('login',{errors:errors.array()});
   } else{
     req.session.user = await UserDB.getUser(req.body.email, req.body.password);
     if(req.session.user != null){
       req.session.userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
           //session.userItems=userconnections;
       var sessionData = {
         userconnections: req.session.userconnections,
         user: req.session.user
       };
       res.render('savedConnections', {sessionData: sessionData});
     } else {
       res.render('login',{errors:[{"msg":"User not found. Please enter the correct credentials"}]});
     }
   }
});

//Login route -- get
router.get('/', async function(req, res, next) {
  if (req.session.user == null) {
    res.render('login', {errors:null});
  } else {
    if(typeof req.query.id == "undefined" && typeof req.query.action == "undefined"){
      userconnections = await userProfileModel.getUserConnectionsForID(req.session.user.userId);
      req.session.user.userItems=userconnections;
      var sessionData = {
        userconnections: session.userItems,
        user: req.session.user
      };
      res.render('savedConnections', {sessionData: sessionData});
    }
  }
});

module.exports = router;
