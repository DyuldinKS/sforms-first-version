var config = require('../config');
var forms = require('../models/form');
var HttpError = require('../error').HttpError;



exports.sendGeneratorPage = function (req, res) {
	res.render('generation&edit', { 
		title: 'Создание формы',
		page: 'Главная',
		type: 'CREATE_FORM',
		id: 'id'
	});
};

exports.sendEditPage = function(req, res, next) {
	res.render('generation&edit', { 
		title: 'Редактирование формы',
		type: 'EDIT_FORM',
		id: req.params.id
	});
}

exports.sendPreviewPage = function(req, res, next) {
	res.render('preview', { id: req.params.id });
}


exports.sendInterviewPage = function(req, res, next) {
	var id = forms.getID(req);
	forms.findOne(id)
		.then(result => {
			if(result) {
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
	    res.send(forms.getHash(result.id));
	  })
  ['catch'](next);
};


exports.update = function(req, res, next) {
	var id = req.form.id;
	var updatedFields = {
		json : req.body
	} 
	// Если форма сохраняется в процессе создания, то дата изменения не записывается в базу
	// Используется для возмодности сортировки по созданным / отредактированным / отправленным формам
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
	var newName = (JSON.parse(req.body)).name;

	var newForm = req.form.json;
	newForm.name = newName;
	forms.add(req.user.id, newForm)
		.then(result => {
			if(result) {
				res.send( forms.getHash(result.id) );
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
	res.json(forms.jsonForClient(req.form, true));
}


exports.getAll = function(req, res, next) {
	forms.findAll(req.user.id)
		.then(result => {
			if(result) {
				var formsList = result.map(forms.jsonForClient);
				res.json(formsList);
			} else {
				next(new HttpError(404, 'Данная форма не найдена.'));
			}
		})
		['catch'](next);
}


