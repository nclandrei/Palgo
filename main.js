var electron = require('electron');
var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1500, height: 825});

    mainWindow.loadURL('file://' + __dirname + '/welcome.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
