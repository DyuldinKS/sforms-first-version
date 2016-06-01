var forms = require('../models/form');
var responses = require('../models/response');
var HttpError = require('../error').HttpError;
var json2csv = require('../lib/json2csv');

var path = require('path');

exports.save = function(req, res, next) {
	var interview = req.body;
	responses.add(interview, req.form.id)
		.then(result => {
			if(result) {
				req.session.completedForms.push(req.params.id);
				res.sendStatus(200);
			}
		})
		['catch'](next);
	
};


exports.sendResponsePage = function(req, res, next) {
	res.render('response', { 
		id: req.params.id, 
		response_id: req.response.id
	});
}


exports.sendResponsesPage = function(req, res, next) {
	res.render('responses', { id: req.params.id });
};


exports.toCSV = function (req, res, next) {
	var report = [];
	responses.findAll(req.form.id)
		.then(result => {
			if(result) {
				var form = req.form.json;
				var allResponses = {
					name : form.name,
					// description : form.description,
					head : form.questions.map(question => {
							return question.title;
						})
				}

				allResponses.body = result.map(responseRow => {
					return allResponses.head.map(question => {
						return responseRow.json[question];
					}) 
				})
				console.log(allResponses);
				var csv = json2csv.export(allResponses);
				console.log(csv);
				res.send(csv);
			}
		})
}


exports.getOne = function(req, res, next) {
	var response = {
		author: req.response.json["Автор"],
		received: req.response.received,
		answers: req.response.json
	}
	res.send(response);
}


exports.getAll = function(req, res, next) {
	var data = {};
	data.form = forms.jsonForClient(req.form, true);

	responses.findAll(req.form.id)
		.then(result => {
			if(result) {
				data.responses = result.map(responses.jsonForClient);
				res.json(data);
			}
		})
		['catch'](next);
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