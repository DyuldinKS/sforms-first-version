exports.get = function (req, res) {
	if(req.session) {
		req.session.destroy(function(err) {
	  	res.redirect('/signin');
		})
	} else {
		res.redirect('/signin');
	}

};
