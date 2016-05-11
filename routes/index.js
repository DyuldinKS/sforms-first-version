var fs = require('fs');
var path = require('path');
var db = require('../models/db.js');
var forms = require('../models/form.js');
var checkAuth = require('../middleware/checkAuth');
var checkFormAuthor = require('../middleware/checkFormAuthor');
var forms = require('./forms.js');
var responses = require('./responses.js');
var reports = require('./reports');

module.exports = function (app) {

  // For browser
  app.get('/', require('./main.js').get);

  app.get('/forms/new', checkAuth, forms.sendGeneratorPage);// get form's generator page
  app.get('/forms/:id/edit', checkFormAuthor, forms.sendEditPage);
  app.get('/forms/:id/preview', checkFormAuthor, forms.sendPreviewPage);
  app.get('/forms/:id', forms.sendInterviewPage);// form's edit page for author; 'interview' page for other
  app.get('/forms/:id/newreport', checkFormAuthor, require('./reports').sendNewReportPage);//create new report on form
  app.get('/forms/:id/responses/:response_id', checkFormAuthor, responses.sendResponsePage);//get one response by id 
  app.get('/forms/:id/reports', checkFormAuthor, require('./reports').getAllByForm);//get all reports by form id

  // Регистрация, авторизация, выход
  app.get('/signup', require('./signUp.js').get);
  app.post('/signup', require('./signUp.js').post);
  app.get('/signin', require('./signIn.js').get);
  app.post('/signin', require('./signIn.js').post);
  app.get('/signout', require('./signOut.js').get);


  // For XMLHttpRequest
  app.get('/api/forms', checkAuth, forms.getAll);//get all forms 
  app.post('/api/forms', checkAuth, forms.save);//save form's template
  
  app.get('/api/forms/:id', forms.getOne);//get form's template in JSON 
  app.post('/api/forms/:id/copy', checkFormAuthor, forms.copy);//copy form's template
  app.post('/api/forms/:id/update', checkFormAuthor, forms.update);//update form's template
  app.delete('/api/forms/:id/delete', checkFormAuthor, forms.delete);
  app.post('/api/forms/:id/send', checkFormAuthor, forms.send);

  
  app.get('/api/forms/:id/responses', checkFormAuthor, responses.getAll);//get all responses
  app.get('api/forms/:id/responses/:response_id', checkFormAuthor, responses.getOne);//get one response by id 
  app.post('/api/forms/:id/responses', checkFormAuthor, responses.save);//save interview (filled form) 
  app.post('/api/forms/:id/reports', checkFormAuthor, require('./reports').save);//save report

}