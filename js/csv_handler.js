function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    return lines
}

function soundex_translation(csv_content) {
	for (var i=0; i<csv_content.length; i++) {
		name_soundex = soundex(csv_content[i][28])
		city_soundex = soundex(csv_content[i][17])
		csv_content[i].push(name_soundex, city_soundex)
	}
	return csv_content
}