var config = require('../config');
var db = require('./db.js')
var Hashids = require("hashids");
hashids = new Hashids(config.get("hashids:salt"), 12);


exports.findOne = function (id) {
  return db.query('SELECT * FROM forms WHERE id = $1;', [id]);
}

exports.findAll = function (user_id) {
	return db.query('SELECT * FROM forms WHERE user_id = $1;', [user_id], true);
}

exports.add = function (user, form) {
  return db.query("INSERT INTO forms(user_id, form) values($1, $2) RETURNING id;", [user, form]);
}

exports.update = function (id, newForm, edited) {
	var queryString = (edited) ?
		"UPDATE forms SET form = $1, edited = current_timestamp WHERE id = $2;" :
		"UPDATE forms SET form = $1 WHERE id = $2;";

	return db.query(queryString, [newForm, id]);
}

// exports.updateNew = function (id) {
// 	return db.query("UPDATE forms SET form = $1 WHERE id = $2;", [newForm, id]);
// }

exports.delete = function (id) {
  return db.query("DELETE FROM forms WHERE id = $1;", [id]);
}

exports.encode = function (pgId) {
  return hashids.encode(pgId);
}

exports.decode = function (id) {
  return +hashids.decode(id);
}