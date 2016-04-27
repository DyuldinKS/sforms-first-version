var path = require('path');
var config = require(__dirname + '/config');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pg = require('pg');
var db = require(__dirname + '/models/db')
var session = require('express-session')
var pgSession = require('connect-pg-simple')(session);
var HttpError = require(__dirname + '/error').HttpError;

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieParser());

app.use(session({
  store: new pgSession({
    pg : pg,                                 
    conString : config.get('pg:url'),
    tableName : 'sessions'           
  }),
  secret: config.get('session:secret'),
  resave: config.get('session:resave'),
  cookie: config.get('session:cookie')
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

require(__dirname + '/routes')(app);

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, send) {
  console.log('ErrorHandler: ', err);
  if(typeof(err) === 'number') {
    err = new HttpError(err);
  } 
  if(err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    res.sendHttpError(new HttpError(500));
  }
  
})



app.set('port', config.get('port'));

app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + config.get('port'));
});
