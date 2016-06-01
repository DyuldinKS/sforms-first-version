var forms = require('../models/form');
var responses = require('../models/response');
var reports = require('../models/report');
var HttpError = require('../error').HttpError;
var json2csv = require('../lib/json2csv');



exports.getAllByForm = function (req, res, next) {
	console.log('reports.getAllByForm');
}

exports.save = function (req, res, next) {

	var order = (JSON.parse(req.body)).columns;
	var report = [];
	responses.findAll(req.form.id)
		.then(result => {
			if(result) {
				var mainTable = report.length;
				report.push({ name : 'Отчёт', head : [], body : []})

				order.forEach(field => {
					var newField = reports.calculateField(result, field);
					if(typeof newField === 'object') {
						report.push(newField);
					} else {
						report[mainTable].head.push(field.newTitle);
						report[mainTable].body.push(reports.calculateField(result, field));
					}
				})

				return reports.add(JSON.stringify(report), req.form.id);
			}
		})

		.then(result => {
			if(result) {
				res.send(json2csv.export(report));
			}
		})
		['catch'](next);
}

