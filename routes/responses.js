var forms = require('../models/form');
var responses = require('../models/response');
var HttpError = require('../error').HttpError;


var path = require('path');

exports.save = function(req, res, next) {
	var id = forms.decode(req.params.id);
	var interview = req.body;

	forms.findOne(id)
		.then(function (result) {
			if(result) {
				return responses.add(interview, result.id);
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


exports.getAll = function(req, res, next) {
	var form_id = forms.decode(req.params.id);
	var data = {};
	forms.findOne(form_id)
		.then(function (result) {
			if(result) {
				data.form = result.form;
				return responses.findAll(form_id);
			} else {
				next(new HttpError(404, 'Undefined form.'));
			}
		})
		.then(function (result) {
			if(result) {
				data.responses = result.map(response => {
					return response.answers;
				})
				res.json(data);
			}
		})
		['catch'](next);
}


exports.getOne = function(req, res, next) {
	console.log('responses.getOne');
}


// responses.find(5)
// 	.then(function (result) {
// 		if(result) {
// 			console.log(result);

// 			var json2csv = require('json2csv');
// 			var fs = require('fs');
// 			var fields = [];
// 			for (var key in result.answers) {
// 				fields.push(key);
// 			}

// 			console.log(fields);
			 
// 			json2csv({ data: [result.answers], fields: fields }, function(err, csv) {
// 			  if (err) console.log(err);
// 			  fs.writeFile('file.csv', csv, function(err) {
// 			    if (err) throw err;
// 			    console.log('file saved');
// 			  });	
// 			});
			
// 			// var json2xls = require('json2xls');
// 			// var xls = json2xls(result.answers);
			
// 			// fs.writeFile('data.xlsx', xls, 'binary', function (err) {
// 			// 	if (err) throw err;
// 			// 	console.log('It\'s saved!');
// 			// });
// 		}
// 	})