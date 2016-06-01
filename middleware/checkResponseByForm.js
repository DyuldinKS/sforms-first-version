var HttpError = require('../error').HttpError;
var responses = require('../models/response.js');

module.exports = function(req, res, next) {
	if(!req.form)
		return next(new HttpError(404, 'Данная форма не найдена.'));

	if(!req.response) 
		return next(new HttpError(404, "Вы не авторизованы"));
	
	return (req.form.id !== req.response.form_id) ?
		next(new HttpError(403, 'Нет доступа к данным.')) : next();
	// var id = +req.params.response_id;
	// responses.findOne(id)
	// 	.then(result => {
	// 		if(result) {
	// 			if(result.form_id === req.form.id) {
	// 				req.response = result;
	// 				next();
	// 			} else {
	// 				next(new HttpError(403, 'Нет доступа к данным.'));
	// 			}
	// 		} else {
	// 			next(new HttpError(404, 'Данный ответ не найден.'));
	// 		}
	// 	})
	// 	["catch"](next);
};