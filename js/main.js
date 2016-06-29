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

function saveData(data) {
    window.localStorage.clear();
    var jsonString = JSON.stringify(data);
    console.log(jsonString.length);
    console.log(jsonString);
    var index = 1;
    var blockLength = 10000;
    while (jsonString.length > 0) {
        var keyName = "allData" + index;

        if (blockLength > jsonString.length) {
            window.localStorage.setItem(keyName, jsonString);
            jsonString = "";
            continue;
        }

        window.localStorage.setItem(keyName, jsonString.substring(0, blockLength));
        jsonString = jsonString.substring(blockLength);
        index++;
    }
}

function readData() {
    var index = 1;

    var allJson = "";

    var savedBlock = window.localStorage.getItem("allData" + index);
    while (savedBlock != null && savedBlock != "") {
        allJson += savedBlock;
        index++;
        savedBlock = window.localStorage.getItem("allData" + index);
    }

    return JSON.parse(allJson);
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
            var phonetic = cell.p;
            if (!matchedWords[cell.o] && phonetic && phonetic.indexOf(query_string) == 0) {
                row.move(j, 0);
                query_results.push(row);
                matchedWords[cell.o] = true;
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
                   o: cellValue, //Original
                   p: convertToPhonetic(cellValue), //Phonetic
                   c: headers[j] //ColumnName
               });
           }
           data.push(dataRow);
        }

        callback(data);
    });
}
