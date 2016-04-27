var config = require('../config');
var bcrypt = require('bcryptjs');
var forms = require('../models/form');

var path = require('path');


exports.create = function (req, res) {
	if(req.user) {
		res.render('generation');
		return;
	}
	res.sendStatus(404);
};


exports.save = function(req, res, next) {
  forms.add(req.user.id, req.body)
    .then(function (result) {
    	var link = config.get('domain') + 'forms/' + forms.encode(result.id);
    	console.log(link);
      res.send(link);
    })
    ['catch'](next);
};


exports.getInterview = function(req, res, next) {
	res.render('interview', { id: req.params.id });
}

exports.showInterview = function(req, res, next) {
	var id = forms.decode(req.params.id);
	forms.find(id)
		.then(function (result) {
			if(result) {
				res.json(result.form);
			} else {
				res.sendStatus(404);
			}
		})
		['catch'](next);
}

