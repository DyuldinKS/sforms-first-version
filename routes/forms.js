var config = require('../config');
var forms = require('../models/form');
var HttpError = require('../error').HttpError;

var path = require('path');


exports.sendGeneratorPage = function (req, res) {
	res.render('generation');
};


exports.sendFormPage = function(req, res, next) {
	var id = forms.decode(req.params.id);

	forms.findOne(id)
		.then(result => {
			if(result) {
				if(req.user) {
					if(req.user.id === result.user_id) {
						res.render('message', { text: 'Вы являетесь создателем этой формы. Для вас здесь будет другая страница.'});
						return;		
					}
				}
				res.render('interview', { id: req.params.id });
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


exports.update = function(req, res, next) {
	var id = forms.decode(req.params.id);
	newForm = req.body;
	// Если форма сохраняется в процессе создания, то дата изменения не записывается в базу
	var edited = ( req.headers.referer !== config.get('domain') + 'forms/new' );
	forms.update(id, newForm, edited)
		.then(result => {
			res.sendStatus(200);
		})
		['catch'](next);
}


exports.copy = function(req, res, next) {
	var id = forms.decode(req.body.id);
	var newName = req.body.name;

	forms.findOne(id)
		.then(result => {
			if(result) {
				var newForm = result.form;
				newForm.name = newName;
				return forms.add(req.user.id, newForm);
			} else {
				res.sendStatus(404);
			}
		})
		.then(result => {
			if(result) {
				res.send( forms.encode(result.id) );
			}
		})
		['catch'](next);
}


exports.delete = function(req, res, next) {
	var id = forms.decode(req.params.id);

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
					return new ModifiedFormObject(formRow);
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