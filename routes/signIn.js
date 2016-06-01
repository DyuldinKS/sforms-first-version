var users = require('../models/user');
var forms = require('../models/form');
var HttpError = require('../error').HttpError;


exports.get = function (req, res, next) {
	res.render('signIn');
};


exports.post = function (req, res, next) {
	var user = JSON.parse(req.body);

	users.findByMail(user.email)
		.then(function (result) {

			if(result && users.compare(user.password, result.password)) {
				req.session.user = users.getHash(result.id);
				res.sendStatus(200);
			} else {
				next(new HttpError(401, 'Неверный логин или пароль. Пожалуйста, попробуйте снова.'));
			}
		})
		['catch'](next);
};
