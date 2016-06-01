var fs = require('fs');

exports.export = function (json) {
	var csv = '';
	!json.length ? 
		csv = parseTable(json) :
		json.forEach(table => {
			csv = csv + parseTable(table)
		});
	return csv;
}


	// console.log(csv);
	// 	fs.writeFile('file.csv', csv, function(err) {
	// 	if (err) throw err;
	// 	console.log('file saved');
	// });


function parseTable(table) {
	var csv = '', subStr;
	for(var key in table) {
		if(typeof table[key] === 'object') {
			
			if(typeof table[key][0] === 'object') { // array of arrays of strings (table body)
				subStr = table[key].reduce((str, tableRow) => {
					return str + '"' + tableRow.join('"\t"') + '"\n';
				}, '');
				
			} else { // array of strings (table head)
				subStr = '"' + table[key].join('"\t"') + '"';
			}
		
		} else { // string (table name or description)
			subStr = '"' + table[key] + '"';
		}

		csv = csv + subStr + '\n';
	}

	return csv + '\n';
}