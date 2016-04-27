var fs = require('fs');
var path = require('path');
var db = require('../models/db.js');
var forms = require('../models/form.js');
var checkAuth = require('../middleware/checkAuth');
var forms = require('./forms.js');

module.exports = function (app) {
  app.get('/', require('./main.js').get);

  app.get('/signin', require('./signIn.js').get);
  app.post('/signin', require('./signIn.js').post);

  app.get('/signout', require('./signOut.js').get);

  app.get('/signup', require('./signUp.js').get);
  app.post('/signup', require('./signUp.js').post);

  app.get('/create', checkAuth, forms.create);
  app.post('/api/forms', checkAuth, forms.save);//save form's pattern

  app.get('/forms/:id', forms.getInterview);//get 'interview' page
  app.get('/api/forms/:id', forms.showInterview);//get form's pattern in JSON 

  app.post('/api/answers/:id', require('./responses.js').saveInterview);

}