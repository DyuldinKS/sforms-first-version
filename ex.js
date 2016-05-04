var json2csv = require('json2csv');
var fs = require('fs');

var result = { 
	id: 5,
  author: '№ 366, физико-математический лицей',
  answers: { 
  	'Наименование мероприятия': 'Олимпиада по математике',
    'Дата проведения мероприятия': '12/04/2016',
    'Объём бюджетных средств, израсходованных на проведение мероприятий (руб.)': '11456.00',
    'Общее количество участников мероприятий (чел.)': '228' 
  },
  form_id: 2,
  created: "Thu Apr 28 2016 00:30:10 GMT+0300 (MSK)" 
};

var fields = [];
for (var key in result.answers) {
	fields.push(key);
}
 
json2csv({ data: result.answers, fields: fields }, function(err, csv) {
  if (err) console.log(err);
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
});