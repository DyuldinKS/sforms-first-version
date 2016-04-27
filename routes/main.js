exports.get = function (req, res, next) {
	if(req.session.user) {
		res.send('Main Page for user: ' + req.session.user);
	} else {
		res.send('Main Page');
	}
};