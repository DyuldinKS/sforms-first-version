var path = require('path');
var config = require(__dirname + '/config');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require(__dirname + '/routes')(app);

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');

app.set('port', config.get('port'));

app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + config.get('port'));
});


// /**
//  * This file provided by Facebook is for non-commercial testing and evaluation
//  * purposes only. Facebook reserves all rights not expressly granted.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
//  * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//  * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//  */

// var fs = require('fs');
// var path = require('path');
// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();

// var COMMENTS_FILE = path.join(__dirname, 'forms.json');

// app.set('port', (process.env.PORT || 3000));

// app.use('/', express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// // Additional middleware which will set headers that we need on each request.
// app.use(function(req, res, next) {
//     // Set permissive CORS header - this allows this server to be used only as
//     // an API server in conjunction with something like webpack-dev-server.
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Disable caching so we'll always get the latest comments.
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });

// app.get('/index', function(req, res) {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.get('/form', function(req, res) {
//   res.sendFile(path.join(__dirname, 'public/form.html'));
// });

// app.post('/', function(req, res) {
//   console.log(req.body);
//   res.redirect('/');
// });

// app.listen(app.get('port'), function() {
//   console.log('Server started: http://localhost:' + app.get('port') + '/');
// });
