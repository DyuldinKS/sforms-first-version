var HttpError = require('../error').HttpError;
var forms = require('../models/form.js');

module.exports = function(req, res, next) {
	if(!req.form)
		return next(new HttpError(404, 'Данная форма не найдена.'));
	
	if(!req.session.completedForms) {
		req.session.completedForms = [];
		next();
	} else {
		// console.log(req.session.completedForms);
		if(!!~req.session.completedForms.indexOf(req.params.id)){
			return next(new HttpError(400, 'Вы уже заполняли данную форму.'));
		}
	}
}
	// var id = forms.decode(req.params.id);

	// forms.findOne(id)
	// 	.then(result => {
	// 		if(result) {
	// 			req.form = result;
	// 			// console.log(req.form);
	// 			next();
	// 		} else {
	// 			next(new HttpError(404, 'Данная форма не найдена.'));
	// 		}
	// 	})
	// 	['catch'](next);
// };