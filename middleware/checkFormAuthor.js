var HttpError = require('../error').HttpError;
var forms = require('../models/form.js');

module.exports = function(req, res, next) {
	if(!req.user) 
		return next(new HttpError(401, "Вы не авторизованы"));
	
	var id = forms.decode(req.params.id);

	forms.findOne(id)
		.then(result => {
			if(result) {
				if(req.user.id === result.user_id) {
					req.form = result;
					next();
				} else {
					next(new HttpError(403, 'Нет доступа к данным.'));
				}
			} else {
				next(new HttpError(404, 'Данная форма не найдена.'));
			}
		})
		['catch'](next);
};