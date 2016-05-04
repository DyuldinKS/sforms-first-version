var fs = require('fs');
var path = require('path');
var db = require('../models/db.js');
var forms = require('../models/form.js');
var checkAuth = require('../middleware/checkAuth');
var forms = require('./forms.js');
var reports = require('./reports');

module.exports = function (app) {
  app.get('/', require('./main.js').get);

  // Регистрация, авторизация, выход
  app.get('/signup', require('./signUp.js').get);
  app.post('/signup', require('./signUp.js').post);

  app.get('/signin', require('./signIn.js').get);
  app.post('/signin', require('./signIn.js').post);

  app.get('/signout', require('./signOut.js').get);

  //
  app.get('/forms/new', checkAuth, forms.sendGeneratorPage);// get form's generator page
  app.get('/forms/:id', forms.sendFormPage);// form's edit page for author; 'interview' page for other


  app.get('/api/forms', checkAuth, forms.getAll);//get all forms 
  app.post('/api/forms', checkAuth, forms.save);//save form's template
  
  app.get('/api/forms/:id', forms.getOne);//get form's template in JSON 
  app.post('/api/forms/copy', checkAuth, forms.copy);//copy form's template
  app.post('/api/forms/:id', checkAuth, forms.update);//update form's template
  app.delete('/api/forms/:id', checkAuth, forms.delete);

  app.get('/api/forms/:id/responses', require('./responses.js').getAll);//get all responses
  app.post('/api/forms/:id/responses', require('./responses.js').save);//save interview (filled form) 

  // app.get('/forms/:id/responses', checkAuth, require('./responses.js').sendResponsesPage);
  app.get('/forms/:form_id/responses/:id', checkAuth, require('./responses.js').getOne);//get one response by id 

  app.get('/forms/:id/newreport', checkAuth, require('./reports').sendNewReportPage);//create new report on form
  // app.get('/api/reports', checkAuth, require('./reports').getAll);//get all reports for main page
  app.get('/forms/:id/reports', checkAuth, require('./reports').getAllByForm);//get all reports by form id

}