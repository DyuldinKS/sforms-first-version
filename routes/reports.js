var forms = require('../models/form');
var responses = require('../models/response');
var reports = require('../models/report');
var HttpError = require('../error').HttpError;
var json2xls = require('json2xls');

exports.sendNewReportPage = function(req, res, next) {
	var id = forms.decode(req.params.id);

	forms.findOne(id)
		.then(function (result) {
			if(result) {
				res.render('report', { id: req.params.id });
			} else {
				next(new HttpError(404, 'Undefined form.'));
			}
		})
		.then(function (result) {
			if(result) {
				res.sendStatus(200);
			}
		})
		['catch'](next);
};


exports.getAllByForm = function (req, res, next) {
	console.log('reports.getAllByForm');
}

exports.save = function (req, res, next) {
	console.log('reports.getAllByForm');
}