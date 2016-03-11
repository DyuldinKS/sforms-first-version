var fs = require('fs');
var path = require('path');
var forms = require('../db/forms.js')


module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('generator');
  });

  app.get('/form', function (req, res) {
    res.render('form');
  });

  app.get('/api/comments', function(req, res) {
    forms.get()
      .then(res.json)

    // fs.readFile(COMMENTS_FILE, function(err, data) {
    //   if (err) {
    //     console.error(err);
    //     process.exit(1);
    //   }
    //   res.json(JSON.parse(data));
    // });
  });

  app.post('/api/comments', function(req, res) {
    console.log(req.body);
    forms.add(req.body);
    // fs.readFile(COMMENTS_FILE, function(err, data) {
    //   if (err) {
    //     console.error(err);
    //     process.exit(1);
    //   }
    //   var comments = JSON.parse(data);
      
    //   var newComment = req.body;
    //   comments.push(newComment);
    //   fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
    //     if (err) {
    //       console.error(err);
    //       process.exit(1);
    //     }
    //     // res.json(comments);
    //     res.redirect('/form');
    //   });
    // });
  });
}