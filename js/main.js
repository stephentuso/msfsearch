const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.









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
