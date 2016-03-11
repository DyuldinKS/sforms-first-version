var mongoose = require('../lib/mongoose');
var Form = require('../models/form.js').Form;

// var form = {
//   "formTitle": "Отчет о международном и межрегиональном сотрудничестве",
//   "formDescription": "ГБОУ № 000 Московского района Санкт-Петербурга за 2015 год",
//   "questions": [
//       {
//           "questionTitle": "Наименование мероприятия",
//           "questionDescription": "-",
//           "questionType": "string",
//           "required": "on"
//       },
//       {
//           "questionTitle": "Дата проведения",
//           "questionDescription": "-",
//           "questionType": "datetime",
//           "required": "on"
//       },
//       {
//           "questionTitle": "Место проведения",
//           "questionDescription": "-",
//           "questionType": "string",
//           "required": "on"
//       },
//       {
//           "questionTitle": "Партнеры",
//           "questionDescription": "-",
//           "questionType": "select",
//           "options": [
//               "МВД",
//               "КГБ",
//               "Мегафон",
//               "Билайн"
//           ],
//           "required": "on"
//       },
//       {
//           "questionTitle": "Результаты",
//           "questionDescription": "Краткое описание",
//           "questionType": "paragraph",
//           "required": "on"
//       }
//   ]
// }

// Очищение базы
// openConnection()
//   .then(function () {
//     return dropDatabase();
//   })


function openConnection() {
  return new Promise(function (resolve, reject) {
    mongoose.connection.on('open', function (err) {
      (err)? reject(err) : resolve();
    })
  })
}


function dropDatabase() {
  return new Promise(function (resolve, reject) {
    mongoose.connection.db.dropDatabase(function (err) {
      (err)? reject(err) : resolve();
    })
  })
}


exports.add = function(form) {
  return new Promise(function (resolve, reject) {
    var newForm = new Form(form);
    newForm.save(function (err) {
      (err)? reject(err) : resolve();
    });
  })
}


exports.get = function() {
  return new Promise(function (resolve, reject) {
    Form.find(function (err, forms) {
      console.log(forms);
      (err)? reject(err) : resolve(forms);
    })
  })
}