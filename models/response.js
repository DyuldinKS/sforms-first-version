var config = require('../config');
var db = require('./db.js');
var Hashids = require("hashids");
var hashids = new Hashids(config.get("hash:response:salt"), config.get("hash:response:length"));


exports.findOne = function (id) {
  return db.query('SELECT * FROM responses WHERE id = $1', [id]);
}

exports.findAll = function (form_id) {
  return db.query('SELECT * FROM responses WHERE form_id = $1', [form_id], true);
}

exports.add = function (answers, formId) {
  return db.query("INSERT INTO responses(json, form_id) values($1, $2) RETURNING id", [answers, formId]);
}

exports.getID = function (params) {
	return params.response_id?
		+hashids.decode(params.response_id) :
		null;
}

exports.getHash = function (id) {
	return hashids.encode(id);
}


exports.jsonForClient = function (responseRow) {
	responseRow.json.id = hashids.encode(responseRow.id);
	return responseRow.json;
}
