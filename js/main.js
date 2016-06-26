function convertToPhonetic(string) {
    return doubleMetaphone(string)[0];
}

function parseCsvFile(file, callback) {
    var parser = new SimpleExcel.Parser.CSV();
    parser.loadFile(file, function() {
        var data = [];

        var sheet = parser.getSheet();
        var headers = [];
        for (var i = 0; i < sheet[0].length; i++) {
            var cell = sheet[0][i];
            headers.push(cell.toString());
        }
        console.log(headers);
        console.log(sheet[0]);

        for (var i = 0; i < sheet.length; i++) {
           var row = sheet[i];
           var dataRow = [];
           for (var j = 0; j < row.length; j++) {
               var cell = row[j];
               var cellValue = cell.toString();
               dataRow.push({
                   original: cellValue,
                   phonetic: convertToPhonetic(cellValue),
                   columnName: headers[j]
               });
           }
           data.push(dataRow);
        }

        callback(data);
    });
}