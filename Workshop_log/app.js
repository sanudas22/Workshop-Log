var express = require('express');
var app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

//set session resources
app.use(session({secret: 'mile3',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var connectionController = require('./controllers/connectionController.js');
var loginController = require('./controllers/loginController.js');
var logoutController = require('./controllers/logoutController.js');
var userActionsController = require('./controllers/userActionsController.js');

app.use('/',connectionController);
app.use('/login',loginController);
app.use('/logout',logoutController);
app.use('/userConnections',userActionsController);
app.use('/*',connectionController);


app.listen(8084,function(){
    console.log('app started')
    console.log('listening on port 8084')
});
