var forms = require('../models/form');
var responses = require('../models/response');
var HttpError = require('../error').HttpError;

var path = require('path');

exports.saveInterview = function(req, res, next) {
	var id = forms.decode(req.params.id);
	var interview = req.body;
	var resultAnswers;

	forms.find(id)
		.then(function (result) {
			if(result) {

				//check recipients

				questions = result.form.questions;
				resultAnswers = interview.answers.map(function(answer, i) {
					return new function() {
						this[questions[i].title] = answer;
					}
				})
				return responses.add(interview.auth, JSON.stringify(resultAnswers), result.id);

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
}