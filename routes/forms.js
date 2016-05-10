var config = require('../config');
var forms = require('../models/form');
var HttpError = require('../error').HttpError;

var path = require('path');


exports.sendGeneratorPage = function (req, res) {
	res.render('generation');
};

exports.sendEditPage = function(req, res, next) {
	res.render('generation', { id: req.form.id });
}

exports.sendPreviewPage = function(req, res, next) {
	res.render('preview', { id: req.form.id });
}


exports.sendInterviewPage = function(req, res, next) {
	var id = forms.decode(req.params.id);
	forms.findOne(id)
		.then(result => {
			if(result) {
				res.render('interview', { id: forms.encode(result.id) });
			} else {
				next(new HttpError(404, 'Данная форма не найдена.'));
			}
		})
		['catch'](next);
	
}


exports.save = function(req, res, next) {
  forms.add(req.user.id, req.body)
    .then(result => {
    	var link = config.get('domain') + 'forms/' + forms.encode(result.id);
    	console.log(link);
      res.send(link);
    })
    ['catch'](next);
};


// var updatedFields = {
// 		form : { 'title' : 'SuperForm'},
// 		edited : true,
// 		sent : true
// 		// status : 'dited'
// 	} 
// 	// updatedFields.edited = true;

// forms.update(34, updatedFields);


exports.update = function(req, res, next) {
	var id = req.form.id;
	var updatedFields = {
		form : req.body
	} 
	// Если форма сохраняется в процессе создания, то дата изменения не записывается в базу
	if ( req.headers.referer !== config.get('domain') + 'forms/new' ) {
		updatedFields.edited = 'current_timestamp';
	}
	
	forms.update(id, updatedFields)
		.then(result => {
			res.sendStatus(200);
		})
		['catch'](next);
}


exports.copy = function(req, res, next) {
	var id = req.form.id;
	var newName = JSON.parse(req.body).name;

	var newForm = req.form.form;
	newForm.name = newName;
	forms.add(req.user.id, newForm)
		.then(result => {
			if(result) {
				res.send( forms.encode(result.id) );
			}
		})
		['catch'](next);
}


exports.delete = function(req, res, next) {
	var id = req.form.id;

	forms.delete(id)
		.then(result => {
			var referer = req.headers.referer;
			if(referer) {
				if(!!~referer.indexOf('/forms/')) {
					res.redirect('/');
					return;
				}
			}
			res.sendStatus(200);
		})
		['catch'](next);
}


exports.send = function(req, res, next) {
	var id = req.form.id;
	var updatedFields = {
		sent : true
	} 
	if(req.body) {
		// отправка почтой
	}

	// изменение статуса
	forms.update(id, updatedFields)
		.then(result => {
			res.sendStatus(200);
		})
		['catch'](next);


}


exports.getOne = function(req, res, next) {
	var id = forms.decode(req.params.id);

	forms.findOne(id)
		.then(result => {
			if(result) {
				res.json(result.form);
			} else {
				res.sendStatus(404);
			}
		})
		['catch'](next);
}


exports.getAll = function(req, res, next) {
	forms.findAll(req.user.id)
		.then(result => {
			if(result) {
				var formsList = result.map(formRow => {
					return new ModifiedForm(formRow);
				})
				res.json(formsList);
			} else {
				next(new HttpError(404, 'Данная форма не найдена.'));
			}
		})
		['catch'](next);
}


// Создание объекта формы из строки таблицы 'forms'
// для отправки списка всех форм
function ModifiedForm(formRow) {
	this.id = forms.encode(formRow.id);
	this.name = formRow.form.name;
	this.description = formRow.form.description;
	this.type = formRow.form.type;
	this.created = formRow.created;
	this.edited = formRow.edited;
	this.sent = formRow.sent;
}