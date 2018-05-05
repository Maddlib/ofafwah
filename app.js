
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

//connect to mongo
mongoose.connect('mongodb://localhost/ofafwah');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    //connected
});

//track logins w/ session
app.use(session({
    secret: 'bros of nukitude',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//parse requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//serve static files
app.use(express.static(__dirname+'/loginRegister'));

//routes
var routes = require('./routes/router');
app.use('/', routes);

//404
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use(function(err, req, res, next){
    res.status(err.status||500);
    res.send(err.message);
});

//listen
app.listen(3000, function(){
    console.log('Express app listening on port 3000');
});