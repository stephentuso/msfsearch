function queryDataPhonetic(data, query_string) {
    query_string = convertToPhonetic(query_string)
    var query_results = []
    for (var i=0; i<data.length; i++) {
        for (var j=0; j<data[i].length; j++) {
            if (data[i][j]["phonetic"] == query_string) {
                query_results.push(data[i])
            }
        }
    }
    return query_results
}

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

// Fuzzy search

// function queryData(data, query_string) {
//     var output_data = []
//     var options = {
//         caseSensitive: false,
//         includeScore: true,
//         shouldSort: true,
//         tokenize: false,
//         keys: ["original", "phonetic", "column_name"],
//     }
//     for (var i=0; i<data.length; i++) {
//         var fuse = new Fuse(data[i], options)
//         var result = fuse.search(query_string)
//         output_data = output_data.concat(result)
//     }
//     console.log(output_data)
// }
