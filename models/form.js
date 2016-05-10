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

exports.update = function (id, updatedFields) {
	var count = 0;
	var values = [];
	var queryString = 'UPDATE forms SET ';
	var keys = Object.keys(updatedFields);

	Object.keys(updatedFields).forEach( (key) => {
		if(key === 'edited' || key === 'sent') {
			queryString = queryString + key + ' = current_timestamp, ';
		} else {
			queryString = queryString + key + ' = $' + ++count + ', ';
			values.push(updatedFields[key]);
		}
	})
	queryString = queryString.slice(0, -2) + ' WHERE id = $' + ++count + ';';
	values.push(id);

	return db.query(queryString, values);
}

exports.delete = function (id) {
	console.log('delete!');
  return db.query("DELETE FROM forms WHERE id = $1;", [id]);
}

exports.encode = function (pgId) {
  return hashids.encode(pgId);
}

exports.decode = function (id) {
  return +hashids.decode(id);
}