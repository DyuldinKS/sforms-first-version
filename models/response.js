var config = require('../config');
var db = require('./db.js')


exports.findOne = function (id) {
  return db.query('SELECT * FROM responses WHERE id = $1', [id]);
}

exports.findAll = function (form_id) {
  return db.query('SELECT * FROM responses WHERE form_id = $1', [form_id], true);
}

exports.add = function (answers, formId) {
  return db.query("INSERT INTO responses(answers, form_id) values($1, $2) RETURNING id", [answers, formId]);
}