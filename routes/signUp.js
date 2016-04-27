var bcrypt = require('bcryptjs');
var users = require('../models/user');
var path = require('path');
var HttpError = require('../error').HttpError;

exports.get = function (req, res, next) {
	if(req.user) {
		next(404, 'You have already logined');
		return;
	}
	res.render('signUp');
};


exports.post = function (req, res, next) {
	var user = req.body;

	users.findByMail(user.email)
		.then(function (result) {
			if(result) {
				next(new HttpError(500, 'Вы уже зарегистрированы. Пожалуйста, авторизуйтесь.'));
			} else {
				return users.add(user);
			}
		})
		.then(function(result) {
			if(result) {
				req.session.user = users.encode(result.id);
				res.sendStatus(200);
			}
		})
		['catch'](next);
};