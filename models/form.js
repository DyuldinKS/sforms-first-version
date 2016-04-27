var config = require('../config');
var db = require('./db.js')
var Hashids = require("hashids");
hashids = new Hashids(config.get("hashids:formSalt"), 16);


exports.find = function (id) {
  return db.query('SELECT * FROM forms WHERE id = $1', [id]);
}

exports.add = function (user, form) {
  return db.query("INSERT INTO forms(user_id, form) values($1, $2) RETURNING id", [user, form]);
}

exports.encode = function (pgId) {
  return hashids.encode(pgId);
}

exports.decode = function (id) {
  return +hashids.decode(id);
}