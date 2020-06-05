var userModel = require('../models/user');
var mongoose = require('mongoose');
var careerBuilderDB = 'mongodb://localhost/careerBuilderDB';
var Schema = mongoose.Schema;
mongoose.connect(careerBuilderDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Model
var userDBModel = mongoose.model('User', new Schema({
    userID: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String
}));

//getting the user
var getUser = async function(email, password) {
    var user;
    await userDBModel.findOne({email:email, password:password}).exec().then((defaultUser) => {
      if(defaultUser == null){
        user = defaultUser;
      }else{
        user = new userModel.user(defaultUser.userID, defaultUser.firstName, defaultUser.lastName, defaultUser.email, defaultUser.password);
      }
    }).catch((err) => {
        console.log(err);
    });
    return user;
}

module.exports.getUser = getUser;
module.exports.UserDB = userDBModel;
