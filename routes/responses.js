var forms = require('../models/form');
var responses = require('../models/response');
var HttpError = require('../error').HttpError;
var conversion = require('../lib/conversion');

var path = require('path');

exports.save = function(req, res, next) {
	var interview = req.body;
	
	responses.add(interview, req.form.id)
		.then(result => {
			if(result) {
				if(!req.form.allowrefil) {
					if(!req.session.completedForms){
						req.session.completedForms = [];
					}
					req.session.completedForms.push(req.params.id);
				}
				
				res.sendStatus(200);
			}
		})
		['catch'](next);
	
};


exports.sendResponsePage = function(req, res, next) {
	res.render('response', { 
		id: req.params.id, 
		response_id: req.params.response_id
	});
}


exports.sendResponsesPage = function(req, res, next) {
	res.render('responses', { id: req.params.id });
};


exports.toCSV = function (req, res, next) {
	responses.findAll(req.form.id)
		.then(result => {
			if(result) {
				var form = req.form.json;
				var i;
				var questions = [], titles = [], body = [];
				titles.push('Автор');

				for(i = 0; i < form.questions.length; i++) {
					questions[i + 1] = form.questions[i];
					titles[i + 1] = form.questions[i].title;
				}

				for(i = 0; i < result.length; i++) {
					body[i] = result[i].json;
				}
				
				var allResponses = {
					name : form.name,
					// description : form.description,
					head : titles,
					body : body
				}
				
				var csv = conversion.json2csv(allResponses);
				res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
				res.set('Content-Type', 'text/csv');
				res.send(csv);
			}
		})
}


exports.getOne = function(req, res, next) {
	var questions = req.form.json.questions; 
	var response = {
		author: req.response.json["Автор"],
		received: req.response.received,
		answers: new responses.JsonForClient(questions, req.response)
	}
	res.send(response);
}


exports.getAll = function(req, res, next) {
	var data = {};
	data.form = new forms.JsonForClient(req.form, true);

	responses.findAll(req.form.id)
		.then(result => {
			if(result) {
				var i, questions = req.form.json.questions; 
				data.responses = [];
				for(i = 0; i < result.length; i++) {
					data.responses[i] = new responses.JsonForClient(questions, result[i]);
				}
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