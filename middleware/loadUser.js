var users = require('../models/user');
var HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
	
  req.user = res.locals.user = null;

  if (!req.session.user) return next();
  var id = users.decode(req.session.user);

  users.findById(id)
		.then(function (result) {
			if(result) {
				req.user = res.locals.user = result;
				return next();
			}
			
			req.session.destroy(function(err) {
		  	res.redirect('/signin');
			})
		})
		['catch'](next);
};