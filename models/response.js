var config = require('../config');
var db = require('./db.js')


exports.find = function (id) {
  return db.query('SELECT * FROM forms WHERE id = $1');
}

exports.add = function (author, answers, formId) {
  return db.query("INSERT INTO responses(author, answers, form_id) values($1, $2, $3) RETURNING id", [author, answers, formId]);
}