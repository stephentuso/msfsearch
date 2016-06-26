Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function processFiles(files) {
    for (var i = 0; i < files.length; i++) {
        (function(index) {
            parseCsvFile(files[index], function(data) {
                allData = allData.concat(data);
                if (index == files.length - 1) {
                    doneProcessing();
                }
            });
        })(i);
    }
}

function doneProcessing() {
    console.log(allData);
    window.localStorage.setItem("allData", JSON.stringify(allData));
    var data = queryDataPhonetic(allData, "jiga");
    console.log(data);
}

function queryDataPhonetic(data, query_string) {
    query_string = convertToPhonetic(query_string);
    console.log(query_string);
    var query_results = [];
    var matchedWords = {};
    for (var i=0; i<data.length; i++) {
        var row = data[i];
        for (var j=0; j<data[i].length; j++) {
            var cell = row[j];
            var phonetic = cell.phonetic;
            if (!matchedWords[cell.original] && phonetic && phonetic.indexOf(query_string) == 0) {
                row.move(j, 0);
                query_results.push(row);
                matchedWords[cell.original] = true;
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

        for (var i = 1; i < sheet.length; i++) {
           var row = sheet[i];
           var dataRow = [];
           for (var j = 0; j < row.length; j++) {
               var cell = row[j];
               var cellValue = cell.toString();
               // Don't store empty cells
               if (cellValue == null || cellValue == "") {
                   continue;
               }
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
