var config = require('../config');
var bcrypt = require('bcryptjs');
var db = require('./db.js');
var Hashids = require("hashids");
hashids = new Hashids(config.get("hashids:userSalt"), 12);


exports.findByMail = function (email) {
	return db.query('SELECT * FROM users WHERE login = $1', [email]);
}

exports.findById = function (id) {
	return db.query('SELECT * FROM users WHERE id = $1', [id]);
}

exports.add = function (user) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(user.password, salt);

	return db.query("INSERT INTO users(login, password) values($1, $2) RETURNING id", [user.email, hash]);
}


exports.encode = function (pgId) {
	return hashids.encode(pgId);
}

exports.decode = function (id) {
	return +hashids.decode(id);
}

exports.compare = function (password, hash) {
	return bcrypt.compareSync(password, hash);
}